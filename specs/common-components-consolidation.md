# Spec — Common Component Consolidation

**Status:** Draft — awaiting review (Specification gate)
**Scope:** `src/common/` across `alsaqr-frontend-v2`, `alsaqr-meetup`, `alsaqr-zook`
**Date:** 2026-07-28

---

## Purpose

Deliver one consistent UI layer shared by all three AlSaqr front-ends — `alsaqr-frontend-v2`,
`alsaqr-meetup`, and `alsaqr-zook` — so that a common component looks and behaves the same in
every app unless a project deliberately overrides it.

Today each project carries its own hand-maintained copy of `src/common/`. The three copies have
drifted: identical component names now render different markup, accept different props, and in two
cases carry bugs that were fixed in one project and never propagated to the others. A shared package
(`alsaqr-web-core`) already exists and already exports most of these components — but **no project
imports its UI from it**. Every UI import still resolves to the local `@common/*` copy.

`alsaqr-frontend-v2` is the reference implementation. Where implementations conflict, its version
wins — it is furthest ahead on test IDs, dark mode, accessibility, and the feed rewrite.

### Why this matters now

- A styling fix must currently be applied three times, and in practice is applied once.
- `alsaqr-web-core` is consumed inconsistently: `meetup` and `zook` pull it from a CDN URL pinned to
  `v0.0.5`, while `meetup`'s `package.json` declares `alsaqr-web-core: file:vendor/alsaqr-web-core-0.0.4.tgz`
  — a **version mismatch against a path that does not exist** (there is no `vendor/` directory).
  A clean `npm install` in `meetup` fails today. `frontend-v2` does not depend on the package at all.
- The duplication is not theoretical: **18 components are triplicated across all three projects and
  already exist in `alsaqr-web-core`.**

---

## Current State — Inventory

### Component presence by project

Legend: ✅ present · — absent · **bold** = canonical source

| File | frontend-v2 | meetup | zook | Already in core? |
|---|:--:|:--:|:--:|:--:|
| `Alerts.tsx` | **✅** | ✅ | ✅ | `DangerAlert` only |
| `AuthModals.tsx` | **✅** | ✅ | ✅ | `LoginModal` |
| `Buttons.tsx` | **✅** | ✅ | ✅ | `ButtonLoader` |
| `Containers.tsx` | **✅** | ✅ | ✅ | ✅ all |
| `CustomLoader.tsx` | **✅** | ✅ | ✅ | ✅ all |
| `IconButtons.tsx` | **✅** | ✅ | ✅ | — |
| `Image.tsx` | ✅ | ✅ | **✅** | ✅ all |
| `Links.tsx` | **✅** | ✅ | ✅ | — |
| `Modal.tsx` | **✅** | ✅ | ✅ | `Modal`, `ModalBody`, `ModalPortal` |
| `Titles.tsx` | **✅** | ✅ | ✅ | ✅ most |
| `UpsertBoxIconButtons.tsx` | **✅** | ✅ | ✅ | — |
| `Tabs.tsx` | **✅** | ✅ | — | — |
| `Inputs.tsx` | **✅** | — | ✅ | `MyInput`, `FileUploadInput`, `MyDatePicker` |
| `Cards.tsx` | — | **✅** | ✅ | — |
| `Carousels.tsx` | — | ✅ | **✅** | — |
| `Collapsible.tsx` | — | **✅** | ✅ | ✅ |
| `LocationModal.tsx` | — | **✅** | ✅ | — |
| `Map.tsx` | — | **✅** | ✅ | — |
| `AdminDashboardLink.tsx` | — | **✅** | ✅ | — |
| `Accordion.tsx` | **✅** | — | — | ✅ |
| `CheckboxCard.tsx` | **✅** | — | — | ✅ |
| `ErrorBoundary.tsx` | **✅** | — | — | — |
| `MultiSelect.tsx` | **✅** | — | — | ✅ |
| `RadioBoxes.tsx` | **✅** | — | — | `RadioCard` |
| `Select.tsx` | **✅** | — | — | ✅ |
| `SearchBar.tsx` | **✅** | — | — | — |
| `EmojiPopover.tsx` | **✅** | — | — | — |
| `MoreSection.tsx` | **✅** | — | — | — |
| `MessageModal.tsx` | **✅** | — | — | — |
| `RegisterForm.tsx` / `ReviewForm.tsx` / `ListOrCommunityForm.tsx` | **✅** | — | — | — |
| `ListOrCommunityUpsertModal.tsx` | **✅** | — | — | — |
| `UpdateCommunityModal.tsx` / `UpdateCommunityDiscussionModal.tsx` | **✅** | — | — | — |
| `RequestedInvitesModal.tsx` | **✅** | — | — | — |
| `FormInputs.tsx` | — | **✅** | — | — |
| `CreateEntityButton.tsx` | — | **✅** | — | — |
| `Selects.tsx` | — | — | **✅** | — |
| `UpsertEntityButton.tsx` | — | — | **✅** | — |

> `SearchInput.tsx` and `SelectUsersForm.tsx` in `frontend-v2` are **0-byte files** and should be deleted.

### The 18 already-solved duplicates

These exist in all three `src/common/` folders **and** are already exported by `alsaqr-web-core`.
They are pure, removable duplication:

`ButtonLoader` · `ContentContainer` · `ContentContainerWithRef` · `DangerAlert` · `FallbackImage` ·
`InfoCardContainer` · `LoginModal` · `MessagesImagePreview` · `ModalLoader` · `NoRecordsTitle` ·
`OptimizedImage` · `OptimizedNewsImage` · `OptimizedPostImage` · `PageTitle` · `ProfileImagePreview` ·
`SkeletonLoader` · `SuspenseLoader` · `TagOrLabel`

`frontend-v2` duplicates a further 8 that core already has: `Accordion`, `FileUploadInput`,
`MultiSelect`, `MyDatePicker`, `MyInput`, `PageTitleNoPadding`, `RadioCard`, `Select`.

### Files that are already byte-identical

Zero-risk consolidations — no reconciliation needed:

- `IconButtons.tsx` — meetup ≡ zook
- `Alerts.tsx` — meetup ≡ zook
- `Links.tsx` — meetup ≡ zook
- `Cards.tsx` — meetup ≡ zook
- `Image.tsx` — frontend-v2 ≡ meetup
- `UpsertBoxIconButtons.tsx` — all three identical apart from trailing whitespace
- `AdminDashboardLink.tsx` — meetup vs zook differ **only by a code comment**
- `CustomLoader.tsx` — component bodies identical; diff is export ordering plus the
  `featherConfig.json` import path (`../animated-icons/` vs `@utils/`)

---

## Interface

The consolidated components keep their existing public props. Every component declares an
`XxxProps` interface per the constitution. Where the three projects disagree on props, the
**union** is taken and the extra props are optional, so no existing call site breaks.

### Props reconciliation required

| Component | Conflict | Resolution |
|---|---|---|
| `ContentContainerWithRef` | v2 accepts `testId`; meetup/zook do not | Adopt v2 — add optional `testId?: string` |
| `TagOrLabel` | v2 + meetup accept `testId`; zook does not | Adopt v2 — add optional `testId?: string` |
| `AddOrFollowButton` | v2 accepts `classNames`; meetup/zook do not | Adopt v2 — add optional `classNames?: string` |
| `CommentIconButton` | v2 accepts `classNames`; meetup/zook do not | Adopt v2 — add optional `classNames?: string` |
| `AbsoluteDangerButton` | zook accepts `classNames`; v2/meetup do not | Add optional `classNames?: string` |
| `CommonButtonProps` | zook declares `classNames` **required**; others omit it | Make optional — zook's required flag is an error |
| `ModalBody` | v2 has `bodyClassNames` + `canCloseLoginModal`; zook has `contentClassNames`; meetup has neither | Adopt v2 names; alias `contentClassNames` → `bodyClassNames` |
| `Carousel` | zook accepts `testId`; meetup does not | Adopt zook — add optional `testId?: string` |
| `CommonLink` | v2 places `data-testid` on the inner element; meetup/zook on the outer | Adopt v2 placement |

### New shared props

- `appVariant?: AppType` — `alsaqr-web-core` already exports
  `type AppType = "default" | "meetup" | "zook"`. This is the sanctioned mechanism for the
  deliberate per-project styling differences catalogued under **Edge Cases**. Components that must
  render differently per app take this prop (defaulting to the configured app) rather than being forked.

---

## Behavior

1. **Core is the single source of truth.** A component that exists in `alsaqr-web-core` is imported
   from the package. The local `src/common/` copy is deleted, not kept as a fallback.
2. **`frontend-v2` wins conflicts.** Where two implementations differ in markup, class names, test
   IDs, or accessibility attributes, the `frontend-v2` version becomes canonical — with the specific
   exceptions listed below.
3. **Documented exceptions where another project wins:**
   - **`Image.tsx` → zook.** zook's `OptimizedImage` adds a `useEffect` that re-syncs internal state
     when the `src` prop changes. v2 and meetup lack it, so those copies render a stale image when
     `src` updates in place. zook's version is correct and becomes canonical.
   - **`Carousels.tsx` → zook.** zook threads a `testId` through to the rendered element.
   - **`Modal.tsx` scroll behavior → zook.** zook's `ModalBody` uses a flex column with
     `overflow-y-auto` on the content region and `shrink-0` on the header, which keeps the header
     pinned while the body scrolls. v2 scrolls the whole dialog. Take zook's scroll structure and
     v2's prop names and close-button semantics.
4. **`VirtualizedFeed` supersedes `FeedContainer`.** `frontend-v2` has replaced the
   `IntersectionObserver` + `LoadMoreTrigger` feed pattern with `VirtualizedFeed` /
   `VirtualizedCardFeed` (`react-virtuoso`), which mounts only visible rows and fires `endReached`
   for pagination. `FeedContainer` is legacy. See **Examples**.
5. **Deliberate per-app differences are expressed as props, not forks** — via `appVariant`.
6. **No visual regressions.** Consolidation is behavior-preserving except where it fixes a bug
   named in this spec.

---

## Constraints

- **Common components only.** Scope is limited to `src/common/` in the three projects, plus
  `VirtualizedFeed` (promoted from `components/shared/` because it replaces a common concern).
  Feature components, routes, stores, and API clients are out of scope.
- Constitution rules apply: React 18 function components, TailwindCSS, TypeScript with no `any` in
  new code, every component declares `XxxProps`, Formik for forms.
- The three projects do **not** share a monorepo — each has its own `package.json`, `vite.config.ts`,
  and path aliases. Sharing must go through the `alsaqr-web-core` package.
- **Path aliases differ and constrain what can move.** `frontend-v2` defines `@enums`, `@typings`,
  `@webWorkers`, and `@animatedIcons`; meetup and zook define none of these. Any component moved to
  core must not depend on a project-local alias.
- `alsaqr-web-core` declares React 18/19 and react-router 6/7 as peer dependencies — all three
  projects must satisfy these before adopting.

---

## Edge Cases

These are the cases the analysis was commissioned to surface: **components with the same name and
the same props that are nonetheless styled differently.** Each needs an explicit ruling, because
naive deduplication would silently change one app's appearance.

| Component | Difference | Ruling |
|---|---|---|
| `Collapsible` | zook adds `h-full` to the wrapper; meetup does not | **Genuine layout difference.** Expose `className` passthrough; zook passes `h-full` at the call site |
| `PageTitle` | v2 is `sticky top-0 z-[999]` with a `bg-gray-50` / `dark:bg-[#0e1517]` backdrop; meetup and zook are static with no background | **Genuine difference.** v2's sticky heading is intentional. Ship both via `appVariant`, or a `sticky?: boolean` prop defaulting to `false` |
| `NoRecordsTitle` | zook adds `w-full` | Harmless — adopt `w-full` everywhere; it is a no-op in a block context |
| `InfoButton` / `AbsoluteDangerButton` | meetup adds `rounded`; v2 and zook do not | **Visible difference.** meetup's rounding is intentional — resolve via `appVariant` |
| `Modal` close button | v2/meetup `top-3`; zook `top-0` plus `background: transparent` | Adopt v2 `top-3`; keep zook's transparent background (fixes a UA default) |
| `LocationModal` close button | meetup `top-3`; zook `top-0` | Adopt meetup |
| `Modal` store binding | meetup reads `loadingUpsert` from `modalStore`; zook from `feedStore` | **Not a styling difference — an API difference.** The shared component must accept `loading` as a prop instead of reaching into a store |
| `CustomLoader` feather config | `../animated-icons/feather.json` vs `@utils/featherConfig.json` | Same asset, different location. Core must bundle it |
| `AuthModals` supabase import | `@utils/supabase` vs `@utils/infrastructure/supabase` | Same client, different path. Core's `getSupabase()` replaces both |

### Bugs found during analysis

Two defects exist today and must be fixed as part of consolidation rather than carried forward:

1. **`zook/src/common/LocationModal.tsx:93`** — the location modal renders
   `data-testid="loginmodal"`, copy-pasted from the login modal. Any Playwright selector for
   `loginmodal` in zook can match the wrong dialog. Correct value is `locationmodal` (as in meetup).
2. **`frontend-v2` and `meetup` `Image.tsx`** — `OptimizedImage` initialises its image URL in state
   but never re-syncs when `src` changes, so a changed `src` on a mounted instance keeps showing the
   old image. Fixed in zook only; the fix must propagate.

### Naming collisions to resolve

The same concern carries three different names across the projects:

| Concern | frontend-v2 | meetup | zook | Proposed |
|---|---|---|---|---|
| Text/select/image form inputs | `Inputs.tsx` (`MyInput`, `MyDatePicker`) | `FormInputs.tsx` (`FormTextInput`, `FormSelectInput`, …) | `Inputs.tsx` (`AlSaqrInput`, `AlSaqrMultiImageUpload`) | Consolidate on core's `MyInput` / `FileUploadInput` / `MyDatePicker`; keep meetup's Formik-bound `Form*` wrappers as the app-facing layer |
| Select | `Select.tsx` (`Select`, `MultiSelect`) | — | `Selects.tsx` (`AlSaqrSelect`, `AlSaqrMultiSelect`) | Core's `Select` + `MultiSelect` |
| Entity create button | `OpenUpsertModalButton` | `CreateEntityButton` | `UpsertEntityButton` | One `UpsertEntityButton` |
| Multi-step modal footer | `ModalFooterButtons` | `CommonUpsertButton` | `FooterButtons` | One `ModalFooterButtons`, store access passed in as props |

`meetup`'s `CommonUpsertButton` and `zook`'s `FooterButtons` each inline the same ~15-line spinner
SVG that already exists as `ButtonLoader` in `CustomLoader.tsx` **and** in core. Three copies of one
spinner — collapse to `ButtonLoader`.

---

## Error Conditions

None. This specification is an analysis and consolidation plan; it defines no new runtime error
states, and no component gains new failure modes. Existing error surfaces — `ErrorBoundary`,
`RouteErrorElement`, `DangerAlert`, `WarningAlert`, and Formik inline field errors — keep their
current behavior and are carried into the shared layer unchanged.

The two defects listed under **Edge Cases** are pre-existing bugs to be fixed, not error conditions
introduced here.

---

## Examples

### `FeedContainer` is legacy — `VirtualizedFeed` replaces it

`FeedContainer` is still exported from `components/shared/Feed.tsx` and
`components/users/UsersFeed.tsx` in both `frontend-v2` and `meetup`. In `frontend-v2` it has been
superseded by `VirtualizedFeed`, which should be treated as the canonical feed primitive:

```tsx
// Legacy — manual IntersectionObserver + a sentinel div; renders every row.
// Still present in alsaqr-meetup/src/components/shared/Feed.tsx
<ContentContainerWithRef innerRef={containerRef} classNames="text-left scrollbar-hide">
  <div className="scrollbar-hide max-h-screen overflow-scroll grid grid-cols-2 …">
    {records.map((rec) => renderCard(rec))}
    <div ref={loaderRef} style={{ height: "20px" }} />
  </div>
</ContentContainerWithRef>

// Canonical — react-virtuoso mounts only visible rows and drives pagination itself.
// alsaqr-frontend-v2/src/components/shared/VirtualizedFeed.tsx
<VirtualizedFeed
  items={records}
  pagination={pagination}
  loading={loading}
  onEndReached={(nextPage) => fetchMore(nextPage)}
  itemContent={(_i, rec) => renderCard(rec)}
  computeItemKey={(_i, rec) => rec.id}
  emptyText="No Nearby Events Found"
  testId="feedcontaineritems"
/>
```

`VirtualizedCardFeed` covers the card-grid case, reproducing the `flex flex-wrap` layout while
virtualizing. Both preserve the `data-testid="feedcontaineritems"` hook, so existing Playwright
selectors keep working across the migration.

### Consolidation, concretely

```tsx
// Before — alsaqr-meetup/src/components/event/EventCard.tsx
import { OptimizedPostImage } from "@common/Image";
import { TagOrLabel } from "@common/Titles";

// After — one implementation, all three apps
import { OptimizedPostImage, TagOrLabel } from "alsaqr-web-core";
```

---

## Acceptance Criteria

1. An inventory exists mapping every `src/common/` export across the three projects to its canonical
   source and its status in `alsaqr-web-core`. *(Delivered above.)*
2. Every same-name/different-style collision has an explicit ruling: unify, or parameterize via
   `appVariant` / `className`. *(Delivered under Edge Cases.)*
3. The 18 triplicated components that already exist in core are imported from core; local copies are
   deleted from all three projects.
4. `frontend-v2` is confirmed canonical, with each exception (`Image`, `Carousels`, `Modal` scroll)
   documented and justified.
5. The `alsaqr-web-core` dependency is consistent across projects: one resolution strategy, one
   version. The broken `file:vendor/alsaqr-web-core-0.0.4.tgz` reference in `meetup` is fixed, and
   the CDN-pinned `v0.0.5` imports resolve through the package rather than a hard-coded URL.
6. Both named bugs are fixed: zook's `loginmodal` test ID, and the `OptimizedImage` `src` re-sync.
7. The three naming collisions are resolved to one name each.
8. The duplicated spinner SVG is replaced by `ButtonLoader` at all three call sites.
9. Empty files (`SearchInput.tsx`, `SelectUsersForm.tsx`) are deleted.
10. All existing Playwright suites pass in all three projects with no changes to selectors, except
    zook's corrected location-modal test ID.

---

## Out of Scope

- Feature components, routes, stores, API clients, and Supabase/Gradio call sites.
- Converting the three repositories into a monorepo.
- Any redesign or visual refresh — this is consolidation, not restyling.
- Migrating `meetup` and `zook` to `VirtualizedFeed`. This spec establishes it as canonical and
  documents the pattern; the migration is separate work.
- Adding test coverage for components that currently have none.
- The rebrand in progress on `main` (`21c88fb`, `99db44c`).
- Publishing or versioning `alsaqr-web-core` itself beyond fixing how the apps consume it.

---

## Open Questions

1. **Distribution.** Should the apps consume `alsaqr-web-core` as a versioned npm/tarball dependency,
   or keep the jsDelivr CDN URL? The current mixed approach is the direct cause of the 0.0.4/0.0.5
   drift. Recommendation: a single pinned package dependency, CDN dropped.
2. **`frontend-v2` adoption.** It currently does not depend on `alsaqr-web-core` at all, yet it is
   the canonical source. Confirm it should adopt the package — otherwise "core" stays a
   meetup/zook concern and v2 continues to drift.
3. **`appVariant` vs `className`.** For the handful of intentional differences (`PageTitle` sticky,
   `InfoButton` rounded), is a variant prop preferred over passing Tailwind classes at the call site?
   Recommendation: `className` passthrough for one-offs, `appVariant` only where the difference is
   systematic.
4. `frontend-v2`'s `ErrorBoundary` / `RouteErrorElement` exist in no other project and are not in
   core. Should they be shared, or do meetup and zook have equivalents elsewhere?
