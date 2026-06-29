# Spec — Access Tokens & Create/Update/Delete for Events, Groups, and Local Guides

> **Status:** Draft — contains open questions (see _Open Questions_). Not ready for the
> planning gate until those are resolved.

## Goal

Let authenticated members contribute content to AlSaqr Meetup, not just browse it. Today
every API call is an unauthenticated `GET`; there is no way to create or manage events,
groups, or local-guide profiles from the app. This feature (1) makes every request carry the
logged-in user's identity, and (2) opens up create / update / delete flows gated by ownership.

## Why

- The app can render events, groups, and local guides but offers no way to add or maintain
  them — the data has to come from somewhere.
- Mutations must be attributable and authorized: only the right user may change a given record.
- The constitution already requires a Supabase bearer token on every authenticated request;
  this is the feature that actually wires that in.

---

## User Stories

1. **As a logged-in user**, my requests carry my identity automatically, so the API can
   personalize responses and authorize my actions without me doing anything.
2. **As a logged-in user**, I can create a new event so others can discover and attend it.
3. **As a logged-in user**, I can create a new group so people can organize around a topic.
4. **As a group founder**, I can edit or delete an event/group I own, so I can keep it
   accurate or remove it.
5. **As a non-owner**, I do **not** see edit/delete controls for content I don't own, and the
   API rejects me if I try anyway.
6. **As a logged-in user**, I can become a local guide through a short guided wizard that is
   pre-filled with my profile data, so signing up takes minimal effort.
7. **As a logged-out user**, create/edit/delete controls are hidden and I'm prompted to log in
   if I attempt a mutating action.

---

## Acceptance Criteria

### Access token
- [ ] When a Supabase session exists, every outgoing API request includes
      `Authorization: Bearer <access_token>`.
- [ ] When no session exists, the header is omitted and public `GET` endpoints still work.
- [ ] The header is attached in **one** central place in the API client (a request
      interceptor), never set by hand at individual call sites.
- [ ] When the token is expired/refreshed by Supabase, subsequent requests use the new token
      (i.e. the token is read live, not captured once).
- [ ] A `401` from the API surfaces a clear "please sign in again" state rather than failing
      silently.

### Events — create / update / delete
- [ ] An event can **only** be created from the **group details page** (an event always
      belongs to a group, so the group is the entry point). There is **no** "Create Event"
      action on the events feed.
- [ ] Creating an event from a group details page pre-associates the event with that group
      (`groupId`/`groupName` are taken from the page, not chosen by the user).
- [ ] A logged-in user can create an event; on success it appears in the relevant feed.
- [ ] Only the owner (see _Open Questions_ on event ownership) can update or delete an event.
- [ ] Edit/delete controls are hidden for non-owners and logged-out users.
- [ ] The API enforces ownership server-side (UI hiding is not the only guard).
- [ ] Required fields are validated inline before submit; the form cannot be submitted invalid.
- [ ] A **city** is selected from a populated cities dropdown and is **required** to create an
      event.

### Groups — create / update / delete
- [ ] A logged-in user can create a group; on success it appears in the relevant feed and the
      creator is recorded as the **founder**.
- [ ] Only the founder can update or delete the group.
- [ ] Edit/delete controls are hidden for non-founders and logged-out users.
- [ ] The API enforces founder-only mutation server-side.
- [ ] Required fields are validated inline before submit.
- [ ] A **city** is selected from a populated cities dropdown and is **required** to create a
      group.

### Local guide wizard
- [ ] The entry-point action reads **"Register As Local Guide"** (not "Create a Local Guide" /
      "Become a Local Guide") — the wording reflects registering an existing user as a guide.
- [ ] A logged-in user can open a multi-step wizard to create their local-guide profile.
- [ ] The city the guide hosts in is selected from a populated cities dropdown and is
      **required** to register as a local guide.
- [ ] On open, the form is pre-populated from the logged-in user's profile (name, avatar,
      contact, bio, location — whatever the profile already holds).
- [ ] The user can edit any pre-filled value before submitting.
- [ ] Required steps/fields are validated before advancing; the user can move backward without
      losing entered data.
- [ ] On submit, the local guide is created and the user is taken to / shown their new guide.
- [ ] A user who already has a local-guide profile is routed to edit rather than create a
      duplicate. _(Confirm — see Open Questions.)_

### Shared UI conventions
- [ ] Every form **submit/primary action button** shows the shared `ButtonLoader` spinner
      (`@common/CustomLoader`) while its request is in flight, and is disabled during submit.
- [ ] The cities dropdown is populated from a single cities source loaded once and reused by
      the event, group, and local-guide forms.

---

## Data Shapes (request / response)

> Response records below already exist in `src/models/`. The mutation **request** shapes are
> proposed here and need confirmation of required vs optional fields (see Open Questions).

### Cities (dropdown source)
Loaded once from `GET /api/Cities` and reused by every create/update form:
```ts
interface City {
  id: number; name: string; stateOrProvince?: string;
  country: string; latitude?: number; longitude?: number;
}
```

### Events
Existing response record (`src/models/event.ts`):
```ts
interface EventRecord {
  id: number; slug: string; name: string; description: string;
  images: any[]; groupId: number; groupName: string;
  citiesHosted: any[]; distanceKm: number;
}
```
Proposed create/update request (`POST /api/Events`, `PUT /api/Events/{id}`):
```ts
interface UpsertEventRequest {
  name: string;            // required
  description: string;     // required
  groupId: number;         // required — set from the group details page, not user-chosen
  citiesHosted: City[];    // required — at least one, picked from the cities dropdown
  images?: ImageUpload[];  // optional
}
```

### Groups
Existing response record (`src/models/group.ts`):
```ts
interface GroupRecord {
  id: number; slug: string; name: string; description: string;
  images: any[]; cityId: number; city: string; country: string;
  topics: any[]; attendees: any[]; longitude: number; latitude: number;
  distanceKm: number;
}
```
Proposed create/update request (`POST /api/Groups`, `PUT /api/Groups/{id}`):
```ts
interface UpsertGroupRequest {
  name: string;            // required
  description: string;     // required
  cityId: number;          // required — picked from the cities dropdown
  topics: string[];        // optional
  images?: ImageUpload[];  // optional
}
```

### Local guide
Existing response record (`src/models/localGuide.ts`):
```ts
interface LocalGuideRecord {
  id: number; slug: string; userId: string; name: string;
  hostedCities: { city; stateOrProvince; country; latitude; longitude }[];
  distanceKm: number;
}
```
Proposed create request (`POST /api/LocalGuides`), pre-filled from profile:
```ts
interface CreateLocalGuideRequest {
  name: string;            // pre-filled from profile, editable
  bio: string;             // pre-filled
  contact: { email?: string; phone?: string };
  hostedCities: HostedCity[]; // required — at least one, picked from the cities dropdown
  // + wizard question answers (TBD — see Open Questions)
}
```

### Delete
- `DELETE /api/Events/{id}` and `DELETE /api/Groups/{id}` — no body; authorized by token +
  ownership.

---

## Out of Scope

- Editing or deleting local-guide profiles (create only for this iteration, unless the
  "already a guide → edit" criterion is confirmed in scope).
- Attendee/RSVP management for events and group membership flows.
- Image hosting/upload infrastructure — assumed to already exist or handled separately.
- Moderation, reporting, or admin override of others' content.
- Role-based permissions beyond the single "owner/founder" check.
- Server-side (backend) implementation details — this spec covers the client behavior and the
  contract it expects.

---

## Open Questions

These must be resolved before the planning gate:

1. **Token source of truth.** The constitution says the bearer token is the **Supabase**
   `access_token`, but the app currently also stores a `jwt` cookie via `src/utils/auth.ts`.
   Which is authoritative for the `Authorization` header — Supabase session or the cookie?
2. **Event ownership.** The spec says events can be changed "only if the user is the founder of
   the **group**." Is event edit/delete authorization tied to the parent group's founder, or
   does an event have its own creator/owner? `EventRecord` currently has no owner/creator field.
3. **Ownership fields are missing from the models.** Neither `EventRecord` nor `GroupRecord`
   exposes a `founderId`/`ownerId`. What field will the client use to decide whether to show
   edit/delete controls?
4. ~~**Form fields.**~~ **Resolved.** Required: event = `name`, `description`, `city`;
   group = `name`, `description`, `city`; local guide = `name`, hosted `city`. Everything else
   (topics, bio, contact, images, state/province) is optional.
5. **Local-guide wizard questions.** "Ask questions in regards to the user" — what are the
   actual steps/questions, and which map to stored fields vs are informational?
6. **Duplicate local guides.** Can a user have more than one local-guide profile? If not, what
   happens when they re-open the wizard — edit existing, or blocked?
7. ~~**Where do entry points live?**~~ **Resolved.** "Create Event" lives **only** on the
   **group details page** (an event always belongs to a group). "Create Group" lives on the
   groups feed. "Register As Local Guide" lives on the local guides feed.
8. **Post-mutation UX.** After create/update/delete, what does the user see — redirect to the
   detail page, toast, optimistic feed update, refetch?
9. **Image upload.** Do create/update forms accept image uploads, and if so against which
   endpoint/storage? (Out of scope above assumes existing infra — confirm.)
