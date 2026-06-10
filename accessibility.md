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

_Pending. Each entry will follow the form:_

```
[YYYY-MM-DD] <Screen> — <issue> — severity: blocker | major | minor
```

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
