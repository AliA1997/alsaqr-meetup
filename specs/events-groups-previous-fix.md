# Spec — User Admin Dashboard, Founder-Gated Events & Topic Autocomplete

> **Status:** Draft. Follow-up/corrective spec to
> [access-token-and-create-update-forms.md](./access-token-and-create-update-forms.md) —
> the previous spec produced incorrect code (no admin surface to manage owned content,
> events creatable by non-founders, no topic source for groups). This spec describes
> **what** and **why**; the **how** belongs in the matching `plan.md`.

## Goal

Give an authenticated member a single place — an **Admin Dashboard** — to manage the
groups and events they own, and tighten event creation so that **only a group's founder**
can add events to that group. Add a **Topic Autocomplete** so groups can be tagged from a
real, server-provided topic list instead of free text.

## Why

- After the previous feature, a logged-in user can create groups/events but has no
  consolidated screen to find, edit, or delete the content they own — they have to hunt
  through the "my events"/"my groups" feeds.
- "Create Event" currently shows for any logged-in user on a group, but an event always
  belongs to a group and should only be added by that group's **founder**. Non-founders
  need a way to reach the founder instead of a control they aren't allowed to use.
- Group topics are currently unconstrained; they should come from a canonical
  `GET /api/Topics` list so groups are tagged consistently and discoverably.
- This is a member's bridge back to their main AlSaqr identity, so the dashboard links out
  to their public AlSaqr social profile.

---

## User Stories

1. **As a logged-in member**, I open an Admin Dashboard from the top of my "My Events" and
   "My Groups" pages, so I can manage everything I own in one place.
2. **As a group founder**, I see my groups and events on the dashboard with edit and delete
   controls, so I can keep them accurate or remove them.
3. **As a member viewing my dashboard**, I can click through to my public AlSaqr social
   profile at `alsaqr.app/users/<username>`, so my Meetup identity stays linked to my main
   profile.
4. **As a group founder**, I can create an event for my group from the group's page.
5. **As a logged-in non-founder viewing a group**, I do **not** see "Create Event"; instead
   I see a **"Contact founder"** action that sends a direct message to the founder pre-filled
   with a default body, so I can reach the founder rather than attempt an action I'm not
   allowed to take.
6. **As a founder creating or editing a group**, I tag it with topics chosen from an
   autocomplete backed by the real topic list, so tagging is fast and consistent.

---

## Acceptance Criteria

### Admin Dashboard
- [ ] `AdminDashboard` follows the **same layout as the AlSaqr `MainProfile`** component
      (`alsaqr-frontend-v2`): a profile-style **header** (banner, avatar, identity, link out
      to the AlSaqr profile) followed by the shared **`Tabs`** component, with one tab per
      managed collection (**My Groups**, **My Events**).
- [ ] Each tab renders the logged-in user's **owned** records (where the user is the founder)
      as cards, each with **Edit** and **Delete** controls. Per-tab data is **lazy-loaded on
      tab switch** (first tab on mount).
- [ ] The **My Groups** tab exposes the **Create Group** entry point (`CreateEntityButton`);
      it no longer appears on the My Groups feed. (Events are still created only from a group's
      details page.)
- [ ] Edit and Delete on the dashboard reuse the existing owner-gated flows
      (`GroupOwnerActions` / `EventOwnerActions` → `UpsertGroupForm` / `UpsertEventForm` /
      `ConfirmModal`); no new edit/delete UI is invented.
- [ ] The header shows a link to the member's AlSaqr social profile at
      `${VITE_PUBLIC_ALSAQR_URL}/users/<username>` (username from
      `authStore.currentSessionUser`). The link opens the external profile (new tab,
      `rel="noopener noreferrer"`).
- [ ] The dashboard is its own **route** (`/admin`), added to `ROUTES_USER_CANT_ACCESS` so it
      is only reachable for a logged-in user; logged-out users are redirected / shown the login
      prompt.
- [ ] A link/entry point to the Admin Dashboard appears **at the very top** of both the
      **My Events** and **My Groups** pages.
- [ ] Empty states: when the user owns no groups (or no events), the dashboard shows a clear
      "nothing yet" message rather than an empty container.

### Founder-gated event creation
- [ ] On a group's page, the "Create Event" action is shown **only** when
      `currentSessionUser.id === group.founderId`.
- [ ] When the viewer is **logged in but not the founder**, the "Create Event" control is
      **replaced** by a **"Contact founder"** action.
- [ ] "Contact founder" sends a **direct message** to the group founder, pre-filled with the
      default body **"Hello, how's the group?"**, via the existing message flow
      (`messageStore`).
- [ ] When the viewer is **logged out**, neither "Create Event" nor "Contact founder" implies
      an authenticated action — the existing logged-out handling (login prompt) applies.
- [ ] Server-side founder enforcement on event create still applies; the UI swap is not the
      only guard.

### Topic autocomplete
- [ ] A new `TopicAutocomplete` component lets the user search and select group topics.
- [ ] `TopicAutocomplete` is built on the **existing `FormAutocompleteInput`**
      (`src/common/FormInputs.tsx`) — no new autocomplete primitive is written.
- [ ] Topic options are loaded from `GET /api/Topics` via the groups API client.
- [ ] The topic list is fetched **once** and reused across forms (no refetch per keystroke or
      per form mount); search filtering happens client-side over the cached list.
- [ ] Selected topics populate the group form's `topics` field (`string[]`) consumed by
      `UpsertGroupRequest`.
- [ ] Required/optional behavior is unchanged: topics remain **optional** on group create
      (per the prior spec); only `name` + `description` are required.

---

## Data Shapes (request / response)

### Topics (autocomplete source)
Loaded once from `GET /api/Topics` and reused by the group form's topic autocomplete:
```ts
interface Topic {
  id: number;
  name: string;
}
```
Mapped to the existing `SelectOption` shape (`{ value, label }`) for `FormAutocompleteInput`.

### Groups (unchanged from prior spec — topics now sourced from `/api/Topics`)
```ts
interface GroupRecord {
  id: number; slug: string; name: string; description: string;
  images: any[]; cityId: number; city: string; country: string;
  topics: any[]; attendees: any[]; longitude: number; latitude: number;
  distanceKm: number;
  founderId?: string; // founder gate for create-event / edit / delete
}

interface UpsertGroupRequest {
  id?: number; name: string; description: string;
  cityId?: number; topics?: string[]; images?: string[];
}
```

### Events (unchanged — ownership inherited from the group founder)
```ts
interface EventRecord {
  id: number; slug: string; name: string; description: string;
  images: any[]; groupId: number; groupName: string;
  citiesHosted: any[]; distanceKm: number;
  groupFounderId?: string; // only this user may create/edit/delete
}
```

### Contact founder (default message)
```ts
interface ContactFounderDraft {
  groupId: number;
  founderId: string;
  message: string; // defaults to "Hello, how's the group?"
}
```

---

## Performance Requirements

The user explicitly requires a performant solution. The spec is satisfied only if:

- [ ] **Topics are loaded once and cached**, mirroring the existing cities pattern in
      `CommonStore` (guard on already-loaded and in-flight so concurrent callers don't
      double-fetch). Re-opening the group form must not re-hit `GET /api/Topics`.
- [ ] **Autocomplete filtering is client-side** over the cached list and **capped** to a
      bounded number of rendered matches (the existing `FormAutocompleteInput` already slices
      to 50) so a large topic list stays responsive; no per-keystroke network calls.
- [ ] **The dashboard reuses already-loaded feed data** from the existing
      `myGroupsFeedStore` / `myEventsFeedStore` registries rather than introducing a parallel
      fetch path; it triggers a load only when those registries are empty.
- [ ] **No redundant re-renders / re-fetches**: ownership checks are simple synchronous
      comparisons; the founder/non-founder branch on the group page does not add network
      calls. Follow the constitution's hooks rules — use `useMemo`/`useCallback` only where a
      genuinely expensive recompute or a referentially-stable callback is required.
- [ ] External profile link is a plain anchor (no client-side data fetch).

---

## Out of Scope

- Building a new messaging system. "Contact founder" composes a pre-filled draft against the
  existing message flow; the underlying messaging infrastructure is assumed to exist.
- Creating/editing **topics** themselves (read-only consumption of `/api/Topics`).
- Editing or deleting local-guide profiles, and the local-guide wizard (covered by the prior
  spec).
- Attendee/RSVP management and group membership flows.
- Server-side implementation of `/api/Topics`, founder enforcement, and ownership — this spec
  covers client behavior and the contract it expects.
- Any change to the access-token / bearer flow already delivered by the prior spec.

---

## Constraints (binding — from the task)

- **Do not edit existing components that are not named in this spec.** Changes are limited to:
  the new `AdminDashboard` and `TopicAutocomplete`; the group page's create-event vs.
  contact-founder swap; the top-of-page dashboard link on **My Events** / **My Groups**; and
  the groups API client + topic caching needed to feed `TopicAutocomplete`.
- **`TopicAutocomplete` must reuse the existing `FormAutocompleteInput`** component — do not
  author a new autocomplete primitive.
- **Do not touch code unrelated to this spec.** Keep the change set minimal and additive;
  prefer composing existing components (`GroupOwnerActions`, `EventOwnerActions`,
  `UpsertGroupForm`, `UpsertEventForm`, `Feed`, modal/button commons) over rewriting them.
- Follow the constitution: function components + hooks, every component declares its
  `XxxProps`, Formik for forms with inline validation, Tailwind for styling, bearer token
  centralized in the API client, no `any` where avoidable.

---

## Open Questions

Resolve before the planning gate:

1. ~~**Dashboard surface — route vs. modal?**~~ **Resolved.** `AdminDashboard` is its own
   **route** at `/admin`, registered in the router and added to `ROUTES_USER_CANT_ACCESS`. The
   top of My Events / My Groups links to it.
2. ~~**AlSaqr profile base URL.**~~ **Resolved.** The link uses the `VITE_PUBLIC_ALSAQR_URL`
   env var with path `/users/<username>`.
3. **Contact founder default copy.** The task wording is "hello, how the group?" — confirm the
   intended copy. This spec assumes **"Hello, how's the group?"**.
4. ~~**Contact founder destination.**~~ **Resolved.** "Contact founder" sends a **direct
   message** to the founder through the existing `messageStore` flow, using the founder's id
   (`group.founderId`). No mailto / external handle is required.
5. **`/api/Topics` response shape & paging.** Is it a flat `Topic[]`, or paged like the
   feeds? If it can be large, confirm the cache-once-then-filter-client-side approach is
   acceptable (assumed here) vs. server-side search.
6. **Topic value sent on submit.** Does `UpsertGroupRequest.topics` expect topic **names**
   (`string[]`, current model) or topic **ids**? `FormAutocompleteInput` stores a single
   `value`; multi-select of topics needs a small wrapper — confirm names vs ids.
