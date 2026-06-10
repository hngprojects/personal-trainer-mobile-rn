# Accessibility — Stage 9

Working log for the Stage 9 accessibility task. Every meaningful change on this
branch gets a line here so the final submission has an auditable record.

**Branch:** `stage9-task-Ukeme-Ikot`
**Base:** branched off `feat/account-management-paywall-toggle` at commit `bd590e0`.
**Standard:** WCAG 2.1 AA, cross-referenced with Apple HIG and Android accessibility
guidelines for platform-specific affordances.
**Deadline:** 2026-06-11.

## Scope

This branch is intentionally narrow. We treat two real user flows end-to-end so the
work is verifiably complete, instead of partially touching every screen.

**Flow A — Discovery call (signed-in purchase path)**

1. Home (`src/features/home/components/HomeScreen.tsx`)
2. Trainer profile (`src/features/trainers/screens/TrainerProfileScreen.tsx`)
3. Trainer intro video (`src/features/trainers/screens/TrainerVideoScreen.tsx`)
4. Book a Call (`src/features/book-a-call/screens/BookACallScreen.tsx`)
   - PlatformStep, DateTimeStep, SummaryStep, SuccessView

**Flow B — Profile edit (account self-service)**

1. Profile tab (`src/features/profile/components/ProfileScreen.tsx`)
2. Personal Information (`src/features/profile/components/PersonalInformationScreen.tsx`)
3. Fitness Preferences (`src/features/profile/components/FitnessPreferencesScreen.tsx`)
4. Account Settings (`src/features/profile/components/AccountSettingsScreen.tsx`)
5. Shared header (`src/features/profile/components/ScreenHeader.tsx`)

**Out of scope for this branch:** onboarding, profile-setup, subscription paywall,
sessions list, reschedule, notifications, FAQ/legal screens. Shared-infra changes
(Phase 2 below) propagate to those screens, but they are not individually audited.

## How the work is organised

Five phases. Each phase has its own section in this file. As work lands, the
relevant section gets file references, what changed, and why.

- **Phase 0** — Branch + this document. Done.
- **Phase 1** — Audit. Walk both flows with TalkBack on a real device; log gaps.
- **Phase 2** — Foundation. Shared-component a11y improvements that benefit every
  screen (`Button`, `Typography`, `TextInput`, `PhoneInput`, toast, theme contrast,
  a new `useReducedMotion` hook, a centralised animation-entries helper).
- **Phase 3** — Flow A (Discovery call). Per-screen fixes.
- **Phase 4** — Flow B (Profile edit). Per-screen fixes.
- **Phase 5** — Verification (TalkBack walkthrough, contrast check, font scale max,
  Reduce Motion, touch-target audit) and APK build for submission.

## Audit findings (Phase 1)

Phase 1 has two halves: a **static audit** (code-reading, completed below) and a
**manual TalkBack walkthrough** (checklist further down, run by the developer on a
real device). Severity scale used throughout:

- **blocker** — flow is unusable with a screen reader, or fails WCAG AA outright on
  a critical element.
- **major** — flow is usable but degraded: missing roles/labels, missing
  state-change announcements, body text below contrast threshold.
- **minor** — polish: redundant announcements, weak hint text, hardened animations.

Each finding ends with the phase that will fix it.

### Static audit — shared infrastructure

Findings that affect every screen (high leverage; fixed once in Phase 2 instead
of per-screen).

| ID  | File                                                                                                 | Issue                                                                                                                                  | Severity | Phase |
| --- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----- |
| S1  | [src/shared/components/Button.tsx](src/shared/components/Button.tsx)                                 | No explicit `accessibilityRole="button"`. No `accessibilityState={{ disabled, busy: isLoading }}`. No `minHeight` enforcem             |
| S2  | [src/shared/components/Typography.tsx](src/shared/components/Typography.tsx)                         | No `maxFontSizeMultiplier` cap on any variant. At max system font scale (~2x), headings overflow card titles and c                     |
| S3  | [src/shared/components/TextInput.tsx](src/shared/components/TextInput.tsx)                           | `label` prop is rendered as a separate Text node, not wired to the input's `accessibilityLabel`. Error text is not a                   |
| S4  | [src/shared/components/PhoneInput.tsx](src/shared/components/PhoneInput.tsx)                         | Country pill has `accessibilityRole="button"` ✓. Country option rows in the picker modal lack `accessibilityRole="                     |
| S5  | [src/shared/components/ToastHost.tsx](src/shared/components/ToastHost.tsx)                           | Toasts are visual-only — no `accessibilityLiveRegion` and no `AccessibilityInfo.announceForAccessibility`. Screen-re                   |
| S6  | [src/shared/theme/colors.ts](src/shared/theme/colors.ts)                                             | Three contrast failures against WCAG AA body text (see Colour contrast verification below): `textSecondary` on background (light), whi |
| S7  | 30+ files across the app use Reanimated `FadeIn*` / `SlideIn*` / `withRepeat` / `withTiming`         | Zero use of `useReducedMotion` (verified via grep). When users enable "Remove animations" on Andro                                     |
| S8  | [src/features/profile/components/SettingsRow.tsx](src/features/profile/components/SettingsRow.tsx)   | Pressable wraps icon + text but: (a) no `accessibilityRole="button"`, (b) row height ≈ 46dp                                            |
| S9  | [src/features/profile/components/ScreenHeader.tsx](src/features/profile/components/ScreenHeader.tsx) | Back button has `hitSlop={12}` (visual 24x24 + 12 slop = 48 effective), but no `accessibil                                             |

### Static audit — Flow A (Discovery call)

| ID  | File / location                                                                                                           | Issue                                                                                                                   | Severity        | Phase |
| --- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------- | ----- |
| A1  | [HomeScreen.tsx](src/features/home/components/HomeScreen.tsx) (top nav)                                                   | Profile-avatar Pressable and notification bell already have `accessibilityRole="button"` and labels ✓. Good baseline —  |
| A2  | [HomeScreen.tsx:411–435](src/features/home/components/HomeScreen.tsx#L411-L435) (category chips)                          | Chips have `accessibilityRole="button"` + `accessibilityState.selected` ✓, but the role should                          |
| A3  | [HomeScreen.tsx:96–179](src/features/home/components/HomeScreen.tsx#L96-L179) (TrainerListItem)                           | Outer trainer Pressable has no `accessibilityLabel` — SR reads each child fragment ("★ 4.5", tr                         |
| A4  | [TrainerImageSlider](src/features/trainers/components/TrainerImageSlider.tsx) inside trainer card                         | Image carousel has no `accessibilityRole="adjustable"`, no announcement of "image 2 of 5". De                           |
| A5  | [TrainerProfileScreen.tsx:206–224](src/features/trainers/screens/TrainerProfileScreen.tsx#L206-L224) (video play button)  | Pressable wraps trainer image + play icon, no label. TalkBack just rea                                                  |
| A6  | [TrainerProfileScreen.tsx:194–202](src/features/trainers/screens/TrainerProfileScreen.tsx#L194-L202) (gallery thumbnails) | Each gallery image is a Pressable with no label. Should announce "Gal                                                   |
| A7  | [TrainerProfileScreen.tsx:247–296](src/features/trainers/screens/TrainerProfileScreen.tsx#L247-L296) (footer buttons)     | Two glass Pressables ("Work With Mario", "Request a Call") have no `acces                                               |
| A8  | [TrainerVideoScreen.tsx:45–51](src/features/trainers/screens/TrainerVideoScreen.tsx#L45-L51) (back button)                | Same shape as ScreenHeader's back button — no role, no label. Note this screen is fu                                    |
| A9  | [BookACallScreen.tsx](src/features/book-a-call/screens/BookACallScreen.tsx) (step progress bar)                           | Visual-only progress bar at the top of each step. No `accessibilityRole="progressbar"`, no `acc                         |
| A10 | [BookACallScreen.tsx](src/features/book-a-call/screens/BookACallScreen.tsx) (step transitions)                            | `SlideInLeft`/`SlideInRight` between steps. No Reduce-Motion guard. Big motion vector; high ves                         |
| A11 | [PlatformStep.tsx:126–169](src/features/book-a-call/components/PlatformStep.tsx#L126-L169) (Zoom/Phone option cards)      | Pressables have no `accessibilityRole="radio"` and no `accessibilityState                                               |
| A12 | [DateTimeStep.tsx:294–322](src/features/book-a-call/components/DateTimeStep.tsx#L294-L322) (calendar day cells)           | **Critical screen.** Day cells are 36x36dp circles with 4dp vertical padding ≈                                          |
| A13 | [DateTimeStep.tsx:245–262](src/features/book-a-call/components/DateTimeStep.tsx#L245-L262) (month nav)                    | Chevron Pressables have `hitSlop={12}` but no `accessibilityLabel="Previous month"` / `                                 |
| A14 | [DateTimeStep.tsx](src/features/book-a-call/components/DateTimeStep.tsx) (time slot chips)                                | Time chips (TIME_SLOTS render path) have the same problem as day cells: visual disabled-state for u                     |
| A15 | [SummaryStep.tsx](src/features/book-a-call/components/SummaryStep.tsx) (detail rows)                                      | Each detail row (Date, Time, Duration, Phone, Contact) renders as `<icon><label><value>` — three separate               |
| A16 | [SuccessView.tsx](src/features/book-a-call/components/SuccessView.tsx)                                                    | The pulsing glow-ring loops indefinitely via `withRepeat` — strong vestibular trigger. Title "Request Submitted!" appea |
| A17 | [SuccessView.tsx](src/features/book-a-call/components/SuccessView.tsx)                                                    | "Back to Home" Button inherits S1 issues. Otherwise OK.                                                                 | (covered by S1) | 2     |

### Static audit — Flow B (Profile edit)

| ID  | File / location                                                                                                                | Issue                                                                                                                    | Severity | Phase |
| --- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------- | ----- |
| B1  | [ProfileScreen.tsx](src/features/profile/components/ProfileScreen.tsx)                                                         | All settings rows go through `SettingsRow` — inherits S8 issues. The theme `<Switch>` for "App Appearance" has no `acces |
| B2  | [ProfileScreen.tsx:90–107](src/features/profile/components/ProfileScreen.tsx#L90-L107) (avatar block)                          | `<Avatar onPress>` with `accessibilityLabel="View profile picture"` ✓. Good.                                             | n/a      | —     |
| B3  | [PersonalInformationScreen.tsx](src/features/profile/components/PersonalInformationScreen.tsx) (chip grids)                    | Gender, Goals, Fitness Level chips are `Pressable`s with no `accessibilityRole="rad                                      |
| B4  | [PersonalInformationScreen.tsx](src/features/profile/components/PersonalInformationScreen.tsx) (CenterModal usage)             | The Newsletter / Location detail modals lack `accessibilityViewIsModal`. Foc                                             |
| B5  | [FitnessPreferencesScreen.tsx](src/features/profile/components/FitnessPreferencesScreen.tsx)                                   | Pressable rows have `accessibilityRole="checkbox"` + `accessibilityState={{ checked, disabled }}`                        |
| B6  | [AccountSettingsScreen.tsx](src/features/profile/components/AccountSettingsScreen.tsx) (deactivate modal)                      | The two CenterModals (Log Out and Deactivate) have no `accessibilityViewIsModal`. The                                    |
| B7  | [AccountSettingsScreen.tsx:74–81](src/features/profile/components/AccountSettingsScreen.tsx#L74-L81) (Deactivate Account link) | Pressable wraps a Typography styled to look like a link. No `acc                                                         |

### Colour contrast verification (WCAG AA: 4.5:1 body / 3:1 large)

Computed using sRGB relative luminance and the standard contrast-ratio formula
against the foreground/background pairs actually rendered in the app.

| Pair                   | Use                                 | Computed ratio | AA body | AA large | Verdict                            |
| ---------------------- | ----------------------------------- | -------------- | ------- | -------- | ---------------------------------- |
| `#131210` on `#FFFFFF` | Light text on background            | ≈ 18.7 : 1     | ✅      | ✅       | PASS                               |
| `#7E7C78` on `#FFFFFF` | Light `textSecondary` on background | ≈ 4.2 : 1      | ❌      | ✅       | **FAIL body** — fix in Phase 2     |
| `#7E7C78` on `#F8F7F5` | Light `textSecondary` on surface    | ≈ 3.9 : 1      | ❌      | ✅       | **FAIL body** — fix in Phase 2     |
| `#5E5C59` on `#FFFFFF` | Light `textMuted` on background     | ≈ 6.8 : 1      | ✅      | ✅       | PASS                               |
| `#FFFFFF` on `#0F2E5C` | Light primary button text           | ≈ 13.3 : 1     | ✅      | ✅       | PASS                               |
| `#EF4444` on `#FFFFFF` | Light error text on background      | ≈ 3.75 : 1     | ❌      | ✅       | **FAIL body** — fix in Phase 2     |
| `#F8F7F5` on `#131210` | Dark text on background             | ≈ 17.5 : 1     | ✅      | ✅       | PASS                               |
| `#9E9B96` on `#131210` | Dark `textSecondary` on background  | ≈ 6.8 : 1      | ✅      | ✅       | PASS                               |
| `#FFFFFF` on `#60A5FA` | Dark primary button text            | ≈ 2.6 : 1      | ❌      | ❌       | **FAIL outright** — fix in Phase 2 |

**Three contrast failures to fix in Phase 2** (in [src/shared/theme/colors.ts](src/shared/theme/colors.ts)):

1. **Dark-mode primary button** (`palette.highlightBlue['4']` = `#60A5FA`) is too light
   for white text. The brand-base navy (`#0F2E5C`) was swapped to `highlightBlue['4']`
   in dark mode to "stay legible against the dark background", but that broke text
   contrast on the button itself. Fix: pick a darker blue with enough contrast
   against both the dark background AND white text — `highlightBlue['5']` (`#1861B8`)
   gives ~5.7:1 against white, which passes.
2. **Light-mode `textSecondary`** (`palette.neutral['5']` = `#7E7C78`) fails for
   body text. Replace with `palette.neutral['6']` (`#5E5C59`, ≈ 6.8:1).
3. **Light-mode `error`** (`palette.highlightRed['5']` = `#EF4444`) is too light for
   body. Replace with `palette.highlightRed['6']` (`#DC2626`, ≈ 4.8:1 against white).

Re-test all pairs after the Phase 2 change.

### Manual TalkBack walkthrough checklist

Verifies what static analysis cannot: focus order, swipe navigation, live-region
behaviour, real touch target hit rates, and motion sensitivity.

**Pre-flight**

- Device: Android 12+ recommended (newer TalkBack has clearer feedback than legacy).
- Enable **TalkBack** (Settings → Accessibility → TalkBack).
- Enable **Layout Bounds** (Developer Options → Show layout bounds) for touch-target audit.
- Set **Display size and text** → **Font size** to the maximum slider position.
- Toggle **Remove animations** (Settings → Accessibility → "Remove animations") for the Reduce Motion pass.
- Build and install a debug APK (`pnpm android` is fine for the audit — release isn't required until Phase 5).

Run the walkthrough **three times** — once normally, once with TalkBack on, once with max font + remove-animations on. Log findings per item using the template at the top of this section.

**Flow A — Discovery call**

1. **Home tab**
   - Swipe-right through every element. Does it land on every interactive control once and only once?
   - Are category chips announced as "selected" when active?
   - Are trainer cards announced as one item ("Mario, Cardio coach, …") or do they fragment into 5+ items?
   - Pull-to-refresh: is the refresh state announced?
   - Tap a trainer card → does the screen transition announce the new screen title?
2. **Trainer profile**
   - Back button announced and accessible?
   - Are the three stat tiles (Exp / Clients / Rating) announced as a group or fragmented?
   - Tap the play-button area on the video card → announced as "Play trainer intro video, button"?
   - Tap a gallery image → fullscreen modal opens; does focus move into the modal? Can you dismiss it with the back gesture?
   - Footer buttons "Work With X" and "Request a Call" — are they both announced as buttons? Is `checking` state announced when tapped?
3. **Trainer intro video** (only relevant if trainer has uploaded video)
   - Back button labelled?
   - Does `<VideoView>` with `nativeControls` expose play/pause/seek to TalkBack? (Platform-dependent.)
4. **Book a Call — PlatformStep**
   - Step progress bar — is "Step 1 of 3" announced when you focus the progress bar?
   - Zoom / Phone option cards — does selecting one and re-focusing announce "selected"? Does swipe order treat them as a radio group?
   - Phone input visible only when Phone is selected. Country pill: tapping opens picker; option rows announced as "United States, +1, selected"?
   - Phone digits: announced one by one as typed? maxLength enforced silently — that's fine.
5. **Book a Call — DateTimeStep**
   - **Calendar** — swipe through day cells. Are weekday/day-number announced ("Wednesday 28, available")? Are past days announced as "disabled"? Is selection announced?
   - Month chevrons — labelled "Previous month" / "Next month"?
   - Time slots — same checks as day cells (announced, selectable, unavailable state).
   - With **Remove animations** on, do step transitions still slide? (They will — that's S7/A10.)
6. **Book a Call — SummaryStep**
   - Each row read as one item ("Date: Wednesday May 28") or fragmented?
   - Submit button — disabled state announced?
7. **Book a Call — Success**
   - On arrival, is "Request Submitted!" auto-announced? (Currently NO — A16.)
   - With Remove animations on, does the glow ring still pulse? (Currently yes — A16.)

**Flow B — Profile edit**

1. **Profile tab**
   - Avatar Pressable announced as "View profile picture, button"?
   - Each SettingsRow announced as one row ("Account Settings, button")?
   - App Appearance Switch — is the label attached? Toggle announces "On" / "Off"?
   - With Layout Bounds on, are any rows <48dp tall?
2. **Personal Information**
   - Edit toggle — labelled?
   - Form: Name TextInput announced with label "Name" and any error?
   - Chip grids (Gender / Goals / Fitness Level) — selected state announced?
   - Save Changes button — loading state announced?
   - Newsletter / Location modals: focus trapped? Dismissible via SR?
3. **Fitness Preferences**
   - Each preference row announced as a checkbox?
   - 5th tap fires "Pick up to 4 goals" toast — is it announced? (Currently NO — S5.)
4. **Account Settings**
   - Linked Accounts "Google: Connected" — readable?
   - Active Sessions row — labelled?
   - Log Out button → modal appears. Focus trapped? "Log Out" destructive action labelled clearly?
   - Deactivate Account — link role announced? Modal opens; same checks as Log Out.

Findings logged from this walkthrough should append below as:

```
[YYYY-MM-DD] [Flow A/B][Screen][Step] — observation — severity
```

(Replace this line once the first walkthrough is logged.)

## Foundation changes (Phase 2)

_Pending. Each entry will follow the form:_

```
- <file:line> — <change> — <why>
```

## Flow A — Discovery call changes (Phase 3)

_Pending. Same entry form as Phase 2._

## Flow B — Profile edit changes (Phase 4)

_Pending. Same entry form as Phase 2._

## Verification (Phase 5)

To be filled in once the audit + fixes are in place. Will include:

- TalkBack walkthrough notes for each flow (device + Android version).
- Colour-contrast verification table (foreground/background pairs we use, computed
  ratio, pass/fail against WCAG AA 4.5:1 body / 3:1 large).
- Font-scale-max observations (screenshots or notes per screen).
- Reduce-Motion observations (which animations short-circuit).
- Touch-target audit using Android's "Layout Bounds" developer option.
- APK build details (versionCode/versionName, Drive link).

## Known limitations

- Out-of-scope screens (see Scope above) inherit Phase 2 shared-component
  improvements but are not individually audited or verified.
- Calendar grid in `DateTimeStep.tsx` may require visible layout changes to meet
  48dp touch targets; trade-offs will be documented in Phase 3.
- Cross-pollination with the in-flight paywall/IAP work on
  `feat/account-management-paywall-toggle` is deliberately avoided — any
  infrastructure changes here that the wider app should adopt will be
  cherry-picked separately, not merged.
