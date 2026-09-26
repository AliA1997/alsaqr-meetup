# Claude Constitution — AlSaqr Meetup App

This document holds the **durable, cross-cutting conventions** for this project.
Feature-specific decisions live in that feature's spec, not here.

---

## What This Is

AlSaqr Meetup is one of three sibling front-ends (`alsaqr-frontend-v2`, `meetup`, `zook`) that
increasingly share UI, clients, and auth through the `alsaqr-web-core` package
(`github:AliA1997/alsaqr-core-web`). React 18 + Vite SPA, MobX for app state, Supabase for auth,
a REST API (via axios) for data, one Gradio call for image moderation. **Contract:** shared UI is
canonically owned by `alsaqr-web-core`, with `alsaqr-frontend-v2` as the reference implementation
when apps disagree (see `specs/common-components-consolidation.md`) — don't fork a component
locally that already exists in that package.

---

## Stack — Non-Default Facts

- **Package manager: npm** (`package-lock.json`).
- **State: MobX**, not just hooks. One store per domain in `src/stores/`, wired through
  `useStore()` (`src/stores/index.ts`) and consumed via `observer(function XxxComponent(...) {})`.
  MobX stores are the primary state layer — local `useState` is for view-only concerns.
- **Tailwind v4**, CSS-first config in `src/index.css` (`@import "tailwindcss"`,
  `@custom-variant dark`, `@source`). `tailwind.config.js` is legacy and inert — nothing wires it
  into the build — see *Do not fix* below.
- **Supabase and Gradio are not local dependencies** — both come from `alsaqr-web-core`
  (`getSupabase()`, `initializeClient()` + `checkNsfwInImage()`). Gradio's one call site
  NSFW-checks an image before it's sent in a direct message (`src/features/Messages.tsx`); it is
  not used for generation or recommendations.
- API base URL is `VITE_PUBLIC_BASE_API_URL`; the axios instance and its interceptors live in
  `src/utils/api/common.ts`.
- Path aliases (`@components`, `@features`, `@hooks`, `@models`, `@stores`, `@utils`, `@typings`)
  are declared in **both** `tsconfig.app.json` and `vite.config.ts` and must be kept in sync by
  hand — `vite-tsconfig-paths` is loaded too, but the manual `resolve.alias` block still exists and
  still wins. `@common` is declared in both files pointing at `src/common/`, which doesn't exist —
  see *Do not fix*.
- Testing: Playwright specs cover events, groups, and local guides (`tests/*.spec.ts`). No
  automated coverage yet for messages, notifications, or admin.

---

## Invariants

### Architecture
- `features/` = routed pages, lazy-loaded per route in `src/router/index.tsx`. `components/` =
  reused inside features, own no route.
- Every component declares an `XxxProps` interface (e.g. `EventCardProps`), even with no props.
- No local "common" component folder — shared, app-wide UI (buttons, modals, loaders, containers)
  comes from `alsaqr-web-core`. Check there before adding a new one; `components/shared/` is for
  this app's own cross-feature (not page-owning) components, e.g. `Feed`, `Carousel`.

### Auth
- Confirmed end-to-end: `useCheckSession` reads the Supabase session and writes `access_token`
  into the `jwt` cookie (`Auth.setToken`); the axios request interceptor in
  `src/utils/api/common.ts` reads that cookie on every request and sets
  `Authorization: Bearer <token>` when present, omits it otherwise. Set the header nowhere else.
- A `401` whose body mentions "access token" resets `authStore` (logs the user out) — that's the
  expiry path; don't add a second one.

### Forms
- Formik on every form (confirmed across events, groups, the local-guide wizard). Validation in
  practice is a hand-written `validate(values)` returning
  `Partial<Record<keyof Values, string>>` — **there is no Yup dependency in this repo.** Follow the
  existing `validate` pattern for new forms; don't introduce Yup piecemeal.
- Before writing a form's `validate`, ask which fields are required vs. optional.

### Hooks
- `useMemo`/`useCallback` only for genuine cost or a real referential-stability need (e.g.
  `fetchCityOptions` in `UpsertEventForm`, stable because a debounced effect depends on it). Never
  `useCallback` for an `onChange` handler.

### Styling
- Tailwind utilities; extract repeats into a component — `components/shared/` for app-local reuse,
  a contribution to `alsaqr-web-core` if more than one AlSaqr app would want it.

### General
- TypeScript everywhere; no new `any`. One concern per file; co-locate a component with its props
  interface.

---

## Do Not "Fix" These

- **`src/index.css`, the `@source "../node_modules/alsaqr-web-core/dist"` line and the removed
  global `button`/`a`/`:root` color rules.** Both are deliberate fixes for a real Tailwind v4 bug:
  importing the vendor's own compiled CSS put two `@layer utilities` blocks in the same cascade
  layer, and the vendor's bare utilities beat this build's responsive variants (`md:flex-row`) at
  equal specificity — variants silently stopped applying. Don't re-import
  `alsaqr-web-core/coreStyles.css` directly, and don't add global element-selector color rules back.
- **`tailwind.config.js`** — its `content` globs point at `./app/**` and `./styles/**`, neither of
  which exists in this Vite project, and nothing `@config`s it into the CSS build. It's dead, not
  broken. Don't "repair" its paths or add theme tokens there expecting them to apply — put them in
  `src/index.css`.
- **The `@common` alias** in `tsconfig.app.json`/`vite.config.ts` resolving to a nonexistent
  `src/common/`: not a bug to fix by creating the directory. That role is now `alsaqr-web-core`
  (see *What This Is*).
- **Pre-existing lint debt.** `npm run lint` currently fails with ~79 errors (mostly
  `no-explicit-any` in `src/models/*.ts`, `src/utils/*.ts`, `typings.d.ts`, and the Playwright
  specs; last touched 2026-07-20, well before recent work). Don't run a repo-wide lint-fix pass as
  a drive-by — clean up lint only in files you're already editing for the task at hand.

---

## Ask Before Acting

- Bumping the `alsaqr-web-core` version/tag (currently pinned to
  `github:AliA1997/alsaqr-core-web#v.0.0.10a`) — it's shared across three apps and a bump can carry
  breaking prop/behavior changes (see the consolidation spec's reconciliation tables).
- Anything touching the Supabase session/cookie flow (`Auth`, `useCheckSession`, the axios
  interceptor) — it's the app's single auth path.
- Renaming or removing a path alias — two config files must stay in sync by hand.
- A spec under `specs/*.md` marked Draft with open questions (e.g.
  `access-token-and-create-update-forms.md`) — resolve the open question with the user rather than
  picking an interpretation.

---

## SDD and Workflow

Five phases run in order, each gated before the next begins. Specs are flat files in `specs/`,
named per feature rather than per phase:

- `specs/<feature>.md` — the spec (what/why, user stories, acceptance criteria, data shapes, out
  of scope). **Gate:** reviewed and approved before planning.
- `specs/<feature>.plan.md` — the plan (how: owning feature/route, reused vs. new components with
  their `XxxProps`, API calls + auth, Supabase/Gradio usage). **Gate:** reviewed; no invented
  implementation detail later without updating the plan first.
- `specs/<feature>.tasks.md` — an ordered, independently-verifiable checklist. **Gate:** every
  acceptance criterion in the spec is covered by at least one task.
- **Implementation** — execute tasks in order per the Code Standards above; one concern per
  commit/PR; diverging from the plan means updating `plan.md`, not silently deviating. **Gate:**
  all tasks checked off.
- **Validation** — verify against the spec's acceptance criteria, not memory. **Gate:** all
  acceptance criteria pass, else return to the failing phase.

---

## Verification

- `npx tsc -b` — currently passes clean; the real type-check gate.
- `npm run build` (`tsc -b && vite build`) — currently succeeds (~3 min). Passing proves the
  bundle compiles, not that the pages render correctly. It also emits a non-fatal warning that the
  main chunk exceeds 500 kB post-minification (most of `node_modules` besides the libraries already
  split out in `vite.config.ts`'s `manualChunks`) — pre-existing, not a build failure.
- `npm run lint` — currently fails on pre-existing debt (see *Do not fix*). A clean run isn't a
  requirement yet, but don't add new errors.
- `npx playwright test` — the functional gate for events/groups/local-guides flows; there is no
  equivalent for messages/notifications/admin, so those need manual verification.
- Manually confirm: bearer-token attach/omit for logged-in vs. logged-out states, Formik inline
  errors for bad and good input, and responsive layout — none of these are automated yet.
