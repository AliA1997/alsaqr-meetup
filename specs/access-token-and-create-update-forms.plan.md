# Plan — Access Tokens & Create/Update/Delete

Realizes [access-token-and-create-update-forms.md](./access-token-and-create-update-forms.md)
within the existing React 18 + MobX + Formik + Tailwind + axios stack.

## Decisions locked (from spec Open Questions)
1. **Token source:** the `jwt` cookie (`src/utils/auth.ts`) is authoritative for the
   `Authorization` header. It is populated from the Supabase session in `useCheckSession`.
2. **Event ownership:** an event is mutable only by the **founder of its parent group**
   (`EventRecord.groupFounderId === currentSessionUser.id`).
3. **Local guide:** one profile per user; re-opening the wizard edits the existing one.
4. **Required fields:** only `name` + `description` are required on create Event/Group forms;
   everything else optional. (Validation library: Yup could not be installed — using Formik's
   centralized `validate` function instead of ad-hoc per-field checks.)

## Routes / ownership
- No new routes. Create/edit happen in modals launched from existing feeds and detail pages.
- Mutations live in the existing feed stores; the API client centralizes the auth header.

## API (endpoint + auth — all carry the bearer token via the central interceptor)
- `POST /api/Events`, `PUT /api/Events/{id}`, `DELETE /api/Events/{id}`
- `POST /api/Groups`, `PUT /api/Groups/{id}`, `DELETE /api/Groups/{id}`
- `GET /api/LocalGuides/my`, `POST /api/LocalGuides`, `PUT /api/LocalGuides/{id}`

## New shared abstractions
- `src/utils/common.ts` — axios **request** interceptor attaching the bearer token (single
  source per the constitution).
- `src/common/FormInputs.tsx` — `FormTextInput`, `FormTextArea`, `FormSelectInput` (Formik
  field + inline error), reused by every form (extracts repeated Tailwind per the constitution).
- Cities source: `src/models/city.ts` (`City`), `src/utils/citiesApiClient.ts`
  (`getCities` → `GET /api/Cities`) registered in `agent`, and `cities` + `loadCities` on
  `CommonStore` (loaded once, reused by every form's dropdown).

## New components (each with an `XxxProps` interface)
- `UpsertEventForm` (`UpsertEventFormProps`) — Formik create/update event.
- `UpsertGroupForm` (`UpsertGroupFormProps`) — Formik create/update group.
- `LocalGuideWizard` (`LocalGuideWizardProps`) — multi-step, pre-filled from profile.
- `EventOwnerActions` / `GroupOwnerActions` — founder-gated edit/delete controls.
- `CreateEntityButton` — logged-in-only "create" entry point for feeds.
- `CreateEventButton` (`CreateEventButtonProps`) — logged-in-only "Create Event" entry point on
  the group details page; passes the page's `groupId`/`groupName` into `UpsertEventForm`.

## UI conventions (this iteration)
- Events are created **only** from the group details page; the events feed has no create button.
- Entry-point wording: "Register As Local Guide" (was "Become a Local Guide").
- All form submit buttons use the shared `ButtonLoader` while their request is in flight.
- A `City` is required on event, group, and local-guide create/update, selected via the shared
  cities dropdown.

## Model changes
- `EventRecord.groupFounderId?: string`; add `UpsertEventRequest`.
- `GroupRecord.founderId?: string`; add `UpsertGroupRequest`.
- `localGuide.ts`: add `UpsertLocalGuideRequest`.

## Constitution rules in play
- Formik for all forms; required fields validated inline.
- Bearer token centralized in the API client; never set at call sites.
- Every component declares `XxxProps`; no `any` in new code where avoidable.
- No `useCallback` for input `onChange`.
