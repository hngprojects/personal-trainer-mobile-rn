# Accessibility — Stage 9

Working log for the Stage 9 accessibility task. Every meaningful change on this
branch gets a line here so the final submission has an auditable record.

**Branch:** `stage9-task-Ukeme-Ikot`
**Base:** branched off `feat/account-management-paywall-toggle` at `bd590e0`.
**Standard:** WCAG 2.1 AA, cross-referenced with Apple HIG and Android
accessibility guidelines for platform-specific affordances.
**Deadline:** 2026-06-11.

## Scope

This branch is intentionally narrow. We treat two real user flows end-to-end so
the work is verifiably complete, instead of partially touching every screen.

**Flow A — Discovery call (signed-in purchase path)**

1. Home (`src/features/home/components/HomeScreen.tsx`)
2. Trainer profile (`src/features/trainers/screens/TrainerProfileScreen.tsx`)
3. Trainer intro video (`src/features/trainers/screens/TrainerVideoScreen.tsx`)
4. Book a Call (`src/features/book-a-call/screens/BookACallScreen.tsx`)
   - PlatformStep, DateTimeStep, SummaryStep, SuccessView

**Flow B — Profile edit (account self-service)**

1. Profile tab (`src/features/profile/components/ProfileScreen.tsx`)
2. Personal Information
   (`src/features/profile/components/PersonalInformationScreen.tsx`)
3. Fitness Preferences
   (`src/features/profile/components/FitnessPreferencesScreen.tsx`)
4. Account Settings
   (`src/features/profile/components/AccountSettingsScreen.tsx`)
5. Shared header (`src/features/profile/components/ScreenHeader.tsx`)

**Out of scope for this branch:** onboarding, profile-setup, subscription
paywall, sessions list, reschedule, notifications, FAQ/legal screens.
Shared-infra changes (Phase 2 below) propagate to those screens, but they are
not individually audited.

## How the work is organised

Five phases. Each phase has its own section in this file. As work lands, the
relevant section gets file references, what changed, and why.

- **Phase 0** — Branch + this document. Done.
- **Phase 1** — Audit. Walk both flows with TalkBack on a real device; log gaps.
- **Phase 2** — Foundation. Shared-component a11y improvements that benefit
  every screen (`Button`, `Typography`, `TextInput`, `PhoneInput`, toast, theme
  contrast, a new `useReducedMotion` hook, a centralised animation-entries
  helper).
- **Phase 3** — Flow A (Discovery call). Per-screen fixes.
- **Phase 4** — Flow B (Profile edit). Per-screen fixes.
- **Phase 5** — Verification (TalkBack walkthrough, contrast check, font scale
  max, Reduce Motion, touch-target audit) and APK build for submission.

## Audit findings (Phase 1)

Phase 1 has two halves: a **static audit** (code-reading, completed below) and
a **manual TalkBack walkthrough** (checklist further down, run by the developer
on a real device).

Severity scale:

- **blocker** — flow is unusable with a screen reader, or fails WCAG AA outright
  on a critical element.
- **major** — flow is usable but degraded: missing roles/labels, missing
  state-change announcements, body text below contrast threshold.
- **minor** — polish: redundant announcements, weak hint text, hardened
  animations.

Each finding ends with the phase that will fix it.

### Static audit — shared infrastructure

Findings that affect every screen (high leverage; fixed once in Phase 2 instead
of per-screen).

- **S1 — `src/shared/components/Button.tsx`** · severity: major · fix: Phase 2
  - No explicit `accessibilityRole="button"`.
  - No `accessibilityState={{ disabled, busy: isLoading }}`.
  - No `minHeight: 48` enforcement (paddingVertical 16 + body1 line-height
    lands near 48dp on default font but shrinks below 48dp at smaller text).

- **S2 — `src/shared/components/Typography.tsx`** · severity: major · fix: Phase 2
  - No `maxFontSizeMultiplier` cap on any variant.
  - At max system font scale (~2x), headings overflow card titles and chip rows.
  - Body should remain unbounded; headings need a cap around 1.6–1.8.

- **S3 — `src/shared/components/TextInput.tsx`** · severity: major · fix: Phase 2
  - `label` prop renders as a sibling Text, not wired to `accessibilityLabel`.
  - Error text is not announced (`accessibilityLiveRegion` not set).
  - Required-field marker is visual-only — no `accessibilityState.required` or
    hint.

- **S4 — `src/shared/components/PhoneInput.tsx`** · severity: minor · fix: Phase 2
  - Country pill has `accessibilityRole="button"` and a label. Good.
  - Country option rows in the picker modal lack `accessibilityRole="radio"`
    and `accessibilityState.selected`.
  - Picker modal lacks `accessibilityViewIsModal` (iOS focus trapping).

- **S5 — `src/shared/components/ToastHost.tsx`** · severity: blocker · fix: Phase 2
  - Toasts are visual-only: no `accessibilityLiveRegion`, no
    `AccessibilityInfo.announceForAccessibility`.
  - Screen-reader users get zero feedback when an error or info toast fires.

- **S6 — `src/shared/theme/colors.ts`** · severity: blocker (dark primary),
  major (others) · fix: Phase 2
  - Three contrast failures vs WCAG AA body text. See "Colour contrast
    verification" below for the table.

- **S7 — Reanimated `FadeIn*` / `SlideIn*` / `withRepeat` / `withTiming`** ·
  severity: major · fix: Phase 2 (helper) + Phases 3/4 (call sites)
  - 30+ files animate; zero use of `useReducedMotion` (grep-verified).
  - Users with "Remove animations" (Android) or "Reduce Motion" (iOS) still see
    every animation.
  - Highest-risk sites: SuccessView's pulsing glow ring (`withRepeat`) and the
    spinning loader logo in HomeScreen / ProfileScreen.

- **S8 — `src/features/profile/components/SettingsRow.tsx`** · severity: major ·
  fix: Phase 2
  - Pressable has no `accessibilityRole="button"`.
  - Row height is ~46dp (paddingVertical 14 + label fontSize 14 line-height
    ~18), 2dp under Android's 48dp minimum.
  - Icon is not marked decorative, so TalkBack reads it plus the label.

- **S9 — `src/features/profile/components/ScreenHeader.tsx`** · severity: minor ·
  fix: Phase 2
  - Back button effective touch target is 48dp via `hitSlop={12}`. Good.
  - No `accessibilityRole="button"`, no `accessibilityLabel="Go back"`.
  - Title is not marked `accessibilityRole="header"`.

### Static audit — Flow A (Discovery call)

- **A1 — HomeScreen.tsx (top nav)** · OK
  - Profile-avatar Pressable and notification bell already have
    `accessibilityRole="button"` plus labels. Leave as-is.

- **A2 — HomeScreen.tsx (category chips, lines 411–435)** · severity: minor ·
  fix: Phase 3
  - Chips have `accessibilityRole="button"` and `accessibilityState.selected`.
  - Role should be `tab` (or `radio`) since chips are single-select. As-is, an
    SR user can't tell selecting one deselects another.

- **A3 — HomeScreen.tsx TrainerListItem (lines 96–179)** · severity: major ·
  fix: Phase 3
  - Outer Pressable has no `accessibilityLabel`. SR fragments the card into 5+
    items (rating star, name, client stack, "Work With").
  - Should announce one composed label: "Mario, Cardio coach, 4.5 stars, 12
    clients. Opens trainer profile."
  - Inner "Work With" Pressable is a nested tappable inside an outer Pressable.
    On Android, TalkBack focuses the outer and the inner becomes unreachable.

- **A4 — TrainerImageSlider inside trainer card** · severity: major ·
  fix: Phase 3
  - Carousel has no `accessibilityRole="adjustable"` and no "image N of M"
    announcement.
  - Decorative noise for SR users in this context — mark the carousel
    `importantForAccessibility="no"` since the parent card's label already
    conveys identity.

- **A5 — TrainerProfileScreen.tsx (video play button, lines 206–224)** ·
  severity: major · fix: Phase 3
  - Pressable wraps trainer image + play icon, no label.
  - TalkBack reads "image, image, button". Should announce "Play trainer intro
    video".

- **A6 — TrainerProfileScreen.tsx (gallery thumbnails, lines 194–202)** ·
  severity: major · fix: Phase 3
  - Each gallery image is a Pressable with no label.
  - Should announce "Gallery image 1 of 5, tap to expand".

- **A7 — TrainerProfileScreen.tsx (footer buttons, lines 247–296)** ·
  severity: major · fix: Phase 3
  - Two glass Pressables ("Work With X", "Request a Call") have no
    `accessibilityRole` and no `accessibilityState.disabled` for `checking`.
  - ActivityIndicator state is invisible to SR.

- **A8 — TrainerVideoScreen.tsx (back button, lines 45–51)** · severity: major ·
  fix: Phase 3
  - Same shape as ScreenHeader's back button — no role, no label.
  - This screen is full-screen video; the back button is the only escape, so a
    label is essential.

- **A9 — BookACallScreen.tsx (step progress bar)** · severity: major ·
  fix: Phase 3
  - Visual-only progress bar at the top of each step.
  - No `accessibilityRole="progressbar"` and no
    `accessibilityValue={{ min: 0, max: 3, now: numericStep }}`.
  - SR users don't know how far through the flow they are.

- **A10 — BookACallScreen.tsx (step transitions)** · severity: major ·
  fix: Phase 3 (uses Phase 2 hook)
  - `SlideInLeft` / `SlideInRight` between steps. No Reduce-Motion guard.
  - Big horizontal motion vector; high vestibular impact.

- **A11 — PlatformStep.tsx (Zoom/Phone option cards, lines 126–169)** ·
  severity: major · fix: Phase 3
  - Pressables have no `accessibilityRole="radio"` and no
    `accessibilityState.selected`.
  - Container needs `accessibilityRole="radiogroup"`.
  - Custom radio outer/inner circles are visual-only; SR can't tell which is
    selected.

- **A12 — DateTimeStep.tsx (calendar day cells, lines 294–322)** ·
  severity: **blocker** · fix: Phase 3
  - Day cells are 36x36dp circles with 4dp vertical padding (~44dp total) —
    under Android's 48dp minimum.
  - No `accessibilityLabel` (e.g., "Wednesday May 28, available").
  - No `accessibilityState.selected` / `disabled`.
  - No `accessibilityRole="button"`.
  - Past/unavailable days are dimmed visually only.
  - Whole calendar grid is unusable with TalkBack.

- **A13 — DateTimeStep.tsx (month nav, lines 245–262)** · severity: major ·
  fix: Phase 3
  - Chevron Pressables use `hitSlop={12}` (effective target OK) but lack
    `accessibilityLabel="Previous month"` / `"Next month"`.
  - Month title has a decorative `chevron-down` icon suggesting a dropdown that
    doesn't exist. Misleading affordance.

- **A14 — DateTimeStep.tsx (time slot chips)** · severity: major · fix: Phase 3
  - Same problems as day cells: visual disabled state for unavailable slots,
    no `accessibilityState.disabled`, no `accessibilityRole="button"`.

- **A15 — SummaryStep.tsx (detail rows)** · severity: major · fix: Phase 3
  - Each row renders as `<icon><label><value>` — three accessible nodes.
  - SR reads disjointly. Compose to one `accessibilityLabel` per row, e.g.
    "Date: Wednesday May 28".

- **A16 — SuccessView.tsx** · severity: **blocker** (no announce), major
  (motion) · fix: Phase 3
  - Pulsing glow ring loops indefinitely via `withRepeat` — strong vestibular
    trigger.
  - "Request Submitted!" appears via `FadeInDown` but isn't auto-announced via
    `accessibilityLiveRegion="polite"` or `accessibilityRole="alert"`. SR users
    get no confirmation the booking succeeded.

- **A17 — SuccessView.tsx "Back to Home" Button** · inherits S1 · fix: Phase 2
  - No additional Flow A work needed once S1 is in.

### Static audit — Flow B (Profile edit)

- **B1 — ProfileScreen.tsx** · severity: major · fix: Phase 4
  - All settings rows inherit S8 issues.
  - "App Appearance" `<Switch>` has no `accessibilityLabel`. The label is in a
    sibling Typography, not attached to the Switch, so SR users hear "switch,
    on" without context.

- **B2 — ProfileScreen.tsx (avatar block, lines 90–107)** · OK
  - Avatar has `onPress` and `accessibilityLabel="View profile picture"`.
    Leave as-is.

- **B3 — PersonalInformationScreen.tsx (chip grids)** · severity: major ·
  fix: Phase 4
  - Gender, Goals, Fitness Level chips are Pressables with no
    `accessibilityRole="radio"` (Gender / Fitness Level) or
    `accessibilityRole="checkbox"` (Goals), and no
    `accessibilityState.selected`.
  - Selected state is colour-only — invisible to SR.
  - Touch target: paddingHorizontal 12 + paddingVertical 8 + fontSize 12 ≈ 36dp
    tall — well under 48dp.

- **B4 — PersonalInformationScreen.tsx (CenterModal usage)** · severity: major ·
  fix: Phase 4
  - Newsletter / Location detail modals lack `accessibilityViewIsModal`. Focus
    isn't trapped — SR can swipe behind the modal.
  - The dismiss handler is a `Pressable absoluteFill` overlay with no
    accessibility annotation; SR users have no clear way to dismiss.

- **B5 — FitnessPreferencesScreen.tsx** · severity: minor (count), blocker
  inherited from S5 · fix: Phase 4
  - Pressable rows have `accessibilityRole="checkbox"` and
    `accessibilityState.checked`. Good.
  - No selection-count announcement (e.g., "3 of 4 selected").
  - When MAX_GOALS is hit, the toast fires but isn't announced (S5).

- **B6 — AccountSettingsScreen.tsx (logout + deactivate modals)** ·
  severity: major · fix: Phase 4
  - Both CenterModals lack `accessibilityViewIsModal`.
  - The destructive "Deactivate" Button needs
    `accessibilityHint="This signs you out"` since the body copy is the only
    signal.

- **B7 — AccountSettingsScreen.tsx (Deactivate Account link, lines 74–81)** ·
  severity: major · fix: Phase 4
  - Pressable wraps a Typography styled to look like a link. No
    `accessibilityRole` (should be `button` or `link`).
  - `textDecorationLine: 'underline'` doesn't get inferred as a link by
    TalkBack.

### Colour contrast verification (WCAG AA: 4.5:1 body / 3:1 large)

Computed using sRGB relative luminance and the standard contrast-ratio formula
against the foreground/background pairs the app actually renders.

- `#131210` on `#FFFFFF` (light text on background) — ≈ 18.7 : 1 — PASS
- `#7E7C78` on `#FFFFFF` (light `textSecondary` on background) — ≈ 4.2 : 1 —
  **FAIL body**, pass large — fix in Phase 2
- `#7E7C78` on `#F8F7F5` (light `textSecondary` on surface) — ≈ 3.9 : 1 —
  **FAIL body**, pass large — fix in Phase 2
- `#5E5C59` on `#FFFFFF` (light `textMuted` on background) — ≈ 6.8 : 1 — PASS
- `#FFFFFF` on `#0F2E5C` (light primary button text) — ≈ 13.3 : 1 — PASS
- `#EF4444` on `#FFFFFF` (light error text on background) — ≈ 3.75 : 1 —
  **FAIL body**, pass large — fix in Phase 2
- `#F8F7F5` on `#131210` (dark text on background) — ≈ 17.5 : 1 — PASS
- `#9E9B96` on `#131210` (dark `textSecondary` on background) — ≈ 6.8 : 1 — PASS
- `#FFFFFF` on `#60A5FA` (dark primary button text) — ≈ 2.6 : 1 — **FAIL
  outright** (body and large) — fix in Phase 2

**Three contrast failures to fix in Phase 2** (in
[src/shared/theme/colors.ts](src/shared/theme/colors.ts)):

1. **Dark-mode primary button** — `palette.highlightBlue['4']` (`#60A5FA`) is
   too light for white text. The brand-base navy (`#0F2E5C`) was swapped to
   `highlightBlue['4']` in dark mode to stay legible against the dark
   background, but that broke text contrast on the button itself. Replace with
   `highlightBlue['5']` (`#1861B8`, ≈ 5.7:1 against white).
2. **Light-mode `textSecondary`** — `palette.neutral['5']` (`#7E7C78`) fails
   body. Replace with `palette.neutral['6']` (`#5E5C59`, ≈ 6.8:1).
3. **Light-mode `error`** — `palette.highlightRed['5']` (`#EF4444`) fails body.
   Replace with `palette.highlightRed['6']` (`#DC2626`, ≈ 4.8:1 against white).

Re-test all pairs after the Phase 2 change.

### Manual TalkBack walkthrough checklist

Verifies what static analysis cannot: focus order, swipe navigation,
live-region behaviour, real touch target hit rates, and motion sensitivity.

**Pre-flight**

- Device: Android 12+ recommended (newer TalkBack is clearer than legacy).
- Enable **TalkBack** (Settings → Accessibility → TalkBack).
- Enable **Layout Bounds** (Developer Options → Show layout bounds) for the
  touch-target pass.
- Set **Display size and text** → **Font size** to the maximum slider position.
- Toggle **Remove animations** (Settings → Accessibility → "Remove animations")
  for the Reduce Motion pass.
- Install a debug APK (`pnpm android` is fine for the audit — release isn't
  required until Phase 5).

Run the walkthrough **three times** — once normally, once with TalkBack on,
once with max font + remove-animations on. Log findings using the template
at the bottom of this section.

**Flow A — Discovery call**

1. **Home tab**
   - Swipe-right through every element. Does it land on every interactive
     control once and only once?
   - Are category chips announced as "selected" when active?
   - Are trainer cards announced as one item ("Mario, Cardio coach, …") or do
     they fragment into 5+ items?
   - Pull-to-refresh: is the refresh state announced?
   - Tap a trainer card → does the screen transition announce the new title?

2. **Trainer profile**
   - Back button announced and accessible?
   - Are the three stat tiles (Exp / Clients / Rating) announced as a group or
     fragmented?
   - Tap the play-button area on the video card → announced as "Play trainer
     intro video, button"?
   - Tap a gallery image → fullscreen modal opens; does focus move into the
     modal? Can you dismiss it with the back gesture?
   - Footer buttons "Work With X" and "Request a Call" — both announced as
     buttons? Is `checking` state announced when tapped?

3. **Trainer intro video** (only if trainer has uploaded one)
   - Back button labelled?
   - Does `<VideoView>` with `nativeControls` expose play/pause/seek to
     TalkBack? (Platform-dependent.)

4. **Book a Call — PlatformStep**
   - Step progress bar — is "Step 1 of 3" announced on focus?
   - Zoom / Phone option cards — selecting one and re-focusing announces
     "selected"? Does swipe order treat them as a radio group?
   - Phone input (visible only when Phone is selected). Country pill: tapping
     opens picker; option rows announced as "United States, +1, selected"?
   - Phone digits: announced one by one as typed? `maxLength` enforced
     silently — that's fine.

5. **Book a Call — DateTimeStep**
   - **Calendar** — swipe through day cells. Are weekday/day-number announced
     ("Wednesday 28, available")? Past days announced as "disabled"? Selection
     announced?
   - Month chevrons — labelled "Previous month" / "Next month"?
   - Time slots — same checks as day cells.
   - With **Remove animations** on, do step transitions still slide? (They
     will — S7/A10.)

6. **Book a Call — SummaryStep**
   - Each row read as one item ("Date: Wednesday May 28") or fragmented?
   - Submit button — disabled state announced?

7. **Book a Call — Success**
   - On arrival, is "Request Submitted!" auto-announced? (Currently NO — A16.)
   - With Remove animations on, does the glow ring still pulse? (Currently
     yes — A16.)

**Flow B — Profile edit**

1. **Profile tab**
   - Avatar Pressable announced as "View profile picture, button"?
   - Each SettingsRow announced as one row ("Account Settings, button")?
   - App Appearance Switch — label attached? Toggle announces "On" / "Off"?
   - With Layout Bounds on, are any rows < 48dp tall?

2. **Personal Information**
   - Edit toggle — labelled?
   - Form: Name TextInput announced with label "Name" and any error?
   - Chip grids (Gender / Goals / Fitness Level) — selected state announced?
   - Save Changes button — loading state announced?
   - Newsletter / Location modals: focus trapped? Dismissible via SR?

3. **Fitness Preferences**
   - Each preference row announced as a checkbox?
   - 5th tap fires "Pick up to 4 goals" toast — is it announced? (Currently
     NO — S5.)

4. **Account Settings**
   - Linked Accounts "Google: Connected" — readable?
   - Active Sessions row — labelled?
   - Log Out button → modal appears. Focus trapped? "Log Out" destructive
     action labelled clearly?
   - Deactivate Account — link role announced? Modal opens; same checks as
     Log Out.

**Walkthrough finding template** — append each observation below as you find
it:

```
[YYYY-MM-DD] [Flow A/B][Screen][Step] — observation — severity
```

(Replace this template line with the first real entry when you start logging.)

## Foundation changes (Phase 2)

Three landed commits cover all nine shared-infra findings (S1–S9).

**Phase 2.1 commit (Button / Typography / SettingsRow / ScreenHeader)**

- `src/shared/components/Button.tsx` — added
  `accessibilityRole="button"`, `accessibilityState={{ disabled, busy }}`,
  `accessibilityLabel` falling back to the visible label; pinned
  `minHeight: 48`. Fixes S1.
- `src/shared/components/Typography.tsx` — heading variants (h1/h2/h3)
  now cap `maxFontSizeMultiplier` to 1.6 / 1.6 / 1.8. Body and label
  remain uncapped so users who rely on enlarged body text still get it.
  Fixes S2.
- `src/features/profile/components/SettingsRow.tsx` — added
  `accessibilityRole="button"` (only when `onPress` is set), composed
  `accessibilityLabel` from `label` + `subtitle`, marked the icon view
  decorative via `importantForAccessibility="no"` /
  `accessibilityElementsHidden`, pinned `minHeight: 48`. Fixes S8.
- `src/features/profile/components/ScreenHeader.tsx` — back button
  gets `accessibilityRole="button"` + `accessibilityLabel="Go back"`;
  title gets `accessibilityRole="header"`. Fixes S9.

**Phase 2.2 commit (TextInput / PhoneInput / ToastHost)**

- `src/shared/components/TextInput.tsx` — the input gets
  `accessibilityLabel` composed from the `label` prop with a
  `", required"` suffix when applicable. Error text is wrapped in a
  polite `accessibilityLiveRegion` so SR users hear it on appear.
  Password visibility toggle gets a button role + dynamic
  "Show/Hide password" label. Fixes S3.
- `src/shared/components/PhoneInput.tsx` — country option rows in the
  picker modal now have `accessibilityRole="radio"` and
  `accessibilityState.selected`. Sheet container has
  `accessibilityViewIsModal` so iOS traps focus. The dismiss overlay
  gets `accessibilityRole="button"` + "Close country picker" label.
  Sheet title gets a header role. Fixes S4.
- `src/shared/components/ToastHost.tsx` — toast view now sets
  `accessibilityLiveRegion` (`assertive` for errors, `polite`
  otherwise) and `accessibilityRole="alert"` for errors. Errors also
  fire `AccessibilityInfo.announceForAccessibility` on appear to cover
  Android versions where live-region behaviour is inconsistent.
  Fixes S5.

**Phase 2.3 commit (useReducedMotion + colors contrast)**

- New `src/shared/hooks/useReducedMotion.ts` — JS-thread subscriber
  for the OS "reduce motion" / "remove animations" preference. Used at
  the prop layer to short-circuit Reanimated entering animations.
- New `src/shared/animation/entries.ts` — exports `maybeAnim(animation,
reduce)` that returns the animation or `undefined`. Lets call sites
  stay one-line: `entering={maybeAnim(FadeInDown.duration(360), reduce)}`.
  Together with the hook above, addresses S7. Phase 3/4 changes thread
  these through call sites.
- `src/shared/theme/colors.ts` — three contrast bumps to clear WCAG AA:
  - Light `textSecondary`: `neutral['5']` (#7E7C78, ≈ 4.2:1) →
    `neutral['6']` (#5E5C59, ≈ 6.8:1).
  - Light `error`: `highlightRed['5']` (#EF4444, ≈ 3.75:1) →
    `highlightRed['6']` (#DC2626, ≈ 4.8:1).
  - Dark `primary` / `primaryPressed` / `tabBarActive`:
    `highlightBlue['4']` (#60A5FA, ≈ 2.6:1 vs white) →
    `highlightBlue['5']` (#1861B8, ≈ 5.7:1 vs white).
    Fixes S6.

## Flow A — Discovery call changes (Phase 3)

Two commits cover all Flow A findings (A2–A17).

**Phase 3.1 commit (Home + Trainer screens)**

- `src/features/home/components/HomeScreen.tsx` — Trainer cards now
  expose a single composed `accessibilityLabel` (`"<Name>, <Specialty>,
<Rating> star rating, <N> clients"`) on the outer Pressable, with all
  decorative children (gradients, image slider, rating badge, info
  column) marked `accessibilityElementsHidden` /
  `importantForAccessibility="no-hide-descendants"`. The inner "Work
  With" Pressable keeps its own button role + composed label so sighted
  users can still book directly; the outer card adds an
  `accessibilityActions` `longpress` action that routes to
  `book-a-session` for SR users, sidestepping the Android nested-
  Pressable unreachability issue. Category chips changed from `button`
  to `tab` role with a `tablist` parent ScrollView. Section titles
  ('Categories', 'Trainers') gain header roles. The blurred background
  image is hidden from a11y. Fixes A2, A3, A4.
- `src/features/trainers/screens/TrainerProfileScreen.tsx` — Gallery
  thumbnails get button role + `"Gallery image N of M"` label +
  `"Tap to expand"` hint. The "See Trainer In Action" video tile gets
  a composed `"Play <Name>'s intro video"` label; the underlying
  trainer image is hidden so SR doesn't double-read. Footer buttons
  ("Work With", "Request a Call") get button roles + composed labels +
  hints; the "Work With" button additionally reflects
  `accessibilityState={{ disabled: checking, busy: checking }}`. The
  top-level back button gets `"Go back"` (added in Phase 3.2 catch-up
  commit). Fixes A5, A6, A7.
- `src/features/trainers/screens/TrainerVideoScreen.tsx` —
  Full-screen video back button gets button role + `"Go back"` label.
  Fixes A8.

**Phase 3.2 commit (Book a Call flow + trainer-profile catch-up)**

- `src/features/book-a-call/screens/BookACallScreen.tsx` — Imported
  `useReducedMotion` and `maybeAnim`. Header back button gets button
  role + label. Progress bar gets
  `accessibilityRole="progressbar"`, label, and
  `accessibilityValue={{ min: 0, max: 3, now: numericStep }}`. Step
  transitions (`SlideInLeft` / `SlideInRight`, `FadeIn` for success)
  routed through `maybeAnim()` so Reduce Motion swaps steps instantly.
  Fixes A9, A10.
- `src/features/book-a-call/components/PlatformStep.tsx` — Wrapped
  option list in a container with `accessibilityRole="radiogroup"`.
  Each option Pressable becomes `accessibilityRole="radio"` with
  `accessibilityState.selected` and a composed label
  ("Zoom Meeting. We will send a Zoom link …"). Visual radio dot, logo
  box, and text column hidden from a11y so SR reads the composed label
  only. Section header gets header role. Fixes A11.
- `src/features/book-a-call/components/DateTimeStep.tsx` — Calendar
  day cells (Phase 1 blocker A12) now each have button role,
  accessibilityLabel like `"Wednesday May 28, today"`, and
  `accessibilityState={{ selected, disabled }}`. `hitSlop={6}`
  expands the 36dp visible circle to a 48dp touch target without a
  visual redesign. Month chevrons get button role + `"Previous month"`
  / `"Next month"` labels; the decorative chevron-down on the month
  title (which suggests a dropdown that doesn't exist) is hidden from
  a11y. Month title row gets header role. Time slot chips get button
  role, selected/disabled state, and `hitSlop={6}`. Fixes A12, A13,
  A14.
- `src/features/book-a-call/components/SummaryStep.tsx` — Each
  detail row sets `accessible` + composed `accessibilityLabel` like
  `"Date: Wednesday May 28"`, so SR reads each row as one item
  instead of three fragments. Fixes A15.
- `src/features/book-a-call/components/SuccessView.tsx` — Title gets
  header role. All entry animations now pass through `maybeAnim()`.
  Critically, the indefinite pulsing glow ring (`withRepeat`) is
  suppressed entirely under Reduce Motion — final state snaps in
  without any motion. On mount, fires
  `AccessibilityInfo.announceForAccessibility` with the full success
  message ("Request submitted. An agent will reach out to you at your
  preferred time.") so SR users hear the booking succeeded. Fixes A16.

A17 was inherited from Phase 2 (S1) — no additional work needed.

## Flow B — Profile edit changes (Phase 4)

Two commits cover all Flow B findings (B1, B3, B4, B5, B6, B7). B2 was
already OK and B8 doesn't exist.

**Phase 4.1 commit (Profile screens — chips, switch, modal)**

- `src/features/profile/components/ProfileScreen.tsx` — App
  Appearance Switch now sets explicit `accessibilityRole="switch"`,
  `accessibilityLabel="Dark mode"`, and `accessibilityState.checked`
  reflecting `isDark`. Before this change the label was in a sibling
  Typography (SettingsRow.label) so TalkBack announced an anonymous
  toggle. Fixes B1.
- `src/features/profile/components/PersonalInformationScreen.tsx` —
  `EditableOptions` chip grid now wraps single-select groups in a
  container with `accessibilityRole="radiogroup"`. Each chip gets
  `accessibilityLabel` from `option.label` and `hitSlop={8}` to clear
  the 48dp WCAG target without redesigning the chip grid. Fixes B3.
- `src/features/profile/components/CenterModal.tsx` — The card
  container is marked `accessibilityViewIsModal` so iOS traps focus
  inside it. The backdrop dismiss Pressable gains
  `accessibilityRole="button"` and a composed `"Close <title>"` label
  so SR users have a discoverable way to dismiss. Title gains header
  role. Fixes B4 — and applies to every screen that uses CenterModal
  (PersonalInformation Newsletter / Location, AccountSettings
  Logout / Deactivate / Delete / Final-delete).

**Phase 4.2 commit (FitnessPreferences count + Account Settings hints)**

- `src/features/profile/components/FitnessPreferencesScreen.tsx` —
  Section header now shows visible count "Preferences (n/4)" and gets
  `accessibilityLiveRegion="polite"` plus a clean
  `accessibilityLabel="Preferences, n of 4 selected"`. SR users now
  hear the running tally as they tick goals on or off. Header gains
  header role. Per-row Pressables already had checkbox role; added
  `accessibilityLabel` from item label, hid thumbnail image and check
  circle from a11y so SR doesn't double-read. Fixes B5.
- `src/features/profile/components/AccountSettingsScreen.tsx` — Every
  destructive Button in the modal stack now has an
  `accessibilityHint` clarifying what it does (Log Out, Deactivate,
  Continue → final delete, Delete Forever). The "Read the account
  deletion policy" Pressable inside the Delete modal gets
  `accessibilityRole="link"` with label + "Opens the policy in your
  browser" hint. SettingsRow upgrades from Phase 2.1 cover the rest
  of B6 and B7.

## Verification (Phase 5)

Verification covers two things:

1. **Static checks** completed at the end of implementation
   (lint, doc consistency, finding-to-commit mapping).
2. **On-device checks** that the developer runs before submission
   (TalkBack walkthrough, font-scale max, Reduce Motion, layout-bounds
   touch-target audit, APK build + install).

### Static verification (completed)

- `pnpm lint --max-warnings 0` exits 0 across every file modified on
  this branch. One pre-existing repo-wide warning (CRLF line endings on
  `src/features/auth/components/AuthBackground.tsx` — last modified in
  commit `e324eef`, out of Stage 9 scope) is unaffected by this branch:
  git's `autocrlf=true` on Windows converts LF → CRLF on checkout and
  Prettier flags the result. Running `pnpm lint:fix` clears it
  in-place but git reconverts on commit. A `.gitattributes` fix for the
  whole repo would solve it, but is out of scope for the accessibility
  branch.
- Finding-to-commit traceability:
  - S1 → Phase 2.1 (Button)
  - S2 → Phase 2.1 (Typography)
  - S3 → Phase 2.2 (TextInput)
  - S4 → Phase 2.2 (PhoneInput)
  - S5 → Phase 2.2 (ToastHost)
  - S6 → Phase 2.3 (colors.ts contrast fixes)
  - S7 → Phase 2.3 (useReducedMotion + maybeAnim) +
    Phase 3.2 (Book a Call call sites) + Phase 3.2 (SuccessView)
  - S8 → Phase 2.1 (SettingsRow)
  - S9 → Phase 2.1 (ScreenHeader)
  - A1 — was already OK; no change required.
  - A2, A3, A4 → Phase 3.1 (HomeScreen).
  - A5, A6, A7 → Phase 3.1 (TrainerProfileScreen).
  - A8 → Phase 3.1 (TrainerVideoScreen) +
    Phase 3.2 (top-level back button catch-up on TrainerProfileScreen).
  - A9, A10 → Phase 3.2 (BookACallScreen).
  - A11 → Phase 3.2 (PlatformStep).
  - A12, A13, A14 → Phase 3.2 (DateTimeStep).
  - A15 → Phase 3.2 (SummaryStep).
  - A16 → Phase 3.2 (SuccessView).
  - A17 → covered by S1 (no per-screen work).
  - B1 → Phase 4.1 (ProfileScreen Switch).
  - B2 — was already OK; no change required.
  - B3 → Phase 4.1 (PersonalInformationScreen EditableOptions).
  - B4 → Phase 4.1 (CenterModal — applies to every consumer).
  - B5 → Phase 4.2 (FitnessPreferencesScreen).
  - B6 → Phase 4.2 (AccountSettingsScreen hints) + Phase 2.1
    (SettingsRow upgrade).
  - B7 → Phase 4.2 (Delete-policy link role inside Delete modal) +
    Phase 2.1 (SettingsRow upgrade — the Deactivate row is now a
    SettingsRow, not the standalone Pressable from the original audit).

### On-device verification (developer to run before submission)

The manual TalkBack walkthrough checklist is at the bottom of the
"Audit findings (Phase 1)" section above. After running it, append
findings inline using the template shown there.

Pre-flight reminders:

- Build the APK with the upload key:
  `cd android; ./gradlew assembleRelease` (or use `pnpm aab` if you
  want a bundle). Confirm the SHA-1 by running keytool against
  `fitcall-release.keystore` and cross-checking it against the
  fingerprint registered in Google Cloud Console for the Android
  OAuth client.
- Install over a clean state: `adb uninstall com.fitcall.app` then
  `adb install -r android/app/build/outputs/apk/release/app-release.apk`.
- TalkBack-walk Flow A and Flow B.
- Toggle "Remove animations" on Android and re-walk:
  - Step transitions in Book a Call should swap instantly (no slide).
  - The SuccessView glow ring should not pulse.
  - Entry FadeIn / FadeInDown across both flows should be skipped.
- Toggle font size to max and re-walk; check chip rows and card
  headings for layout breakage. Headings are capped via
  `maxFontSizeMultiplier`, so they should stay bounded; body text
  should scale up.
- Toggle Layout Bounds on (Developer Options) and confirm:
  - All Buttons are ≥ 48dp tall.
  - All SettingsRows are ≥ 48dp tall.
  - Calendar day cells have an effective ≥ 48dp target via hitSlop
    (the visible circle is still 36dp — that's fine, hitSlop expands
    the touch region without changing layout).
- Upload the APK to Drive, paste the link into the Slack submission
  message tagging yourself + mentors.

## Known limitations

- Out-of-scope screens (see Scope above) inherit Phase 2 shared-component
  improvements but are not individually audited or verified.
- Calendar grid in `DateTimeStep.tsx` may require visible layout changes to
  meet 48dp touch targets; trade-offs will be documented in Phase 3.
- Cross-pollination with the in-flight paywall/IAP work on
  `feat/account-management-paywall-toggle` is deliberately avoided — any
  infrastructure changes here that the wider app should adopt will be
  cherry-picked separately, not merged.
