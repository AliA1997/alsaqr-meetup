# Tasks — Access Tokens & Create/Update/Delete

Ordered, each independently verifiable. Covers every acceptance criterion in the spec.

- [x] 1. Add axios **request** interceptor attaching `Authorization: Bearer <jwt cookie>` when
      present (central, single place). — _AC: access token_
- [x] 2. Populate the `jwt` cookie from the Supabase session in `useCheckSession`; clear it on
      sign-out. — _AC: token read live / cleared_
- [x] 3. Models: add `groupFounderId` to `EventRecord`, `founderId` to `GroupRecord`, and the
      `Upsert*Request` request shapes. — _AC: ownership data_
- [x] 4. API client: add create/update/delete for events and groups, and
      getMy/create/update for local guides. — _AC: REST functionality_
- [x] 5. Feed stores: add create/update/delete actions + `loadingUpsert`; keep the registry in
      sync. — _AC: appears in feed after create_
- [x] 6. Shared `FormInputs` (text + textarea with inline errors). — _AC: inline validation_
- [x] 7. `UpsertEventForm` + `UpsertGroupForm` (Formik, name/description required). — _AC: create/update_
- [x] 8. `LocalGuideWizard` (multi-step, pre-filled from profile, edit if exists). — _AC: wizard_
- [x] 9. `CreateEntityButton` wired into the group/event feeds and local-guides feed
      (logged-in only). — _AC: entry points / hidden when logged out_
- [x] 10. `EventOwnerActions` / `GroupOwnerActions` founder-gated edit+delete in detail cards. — _AC: owner-only mutate_
- [ ] 12. Cities source: `City` model, `citiesApiClient.getCities` (`GET /api/Cities`) wired
      into `agent`, and `cities`/`loadCities` on `CommonStore` (load once). — _AC: dropdown source_
- [ ] 13. Shared `FormSelectInput` (Formik select + inline error) in `FormInputs`. — _AC: cities dropdown_
- [ ] 14. Event creation moved to the **group details page** only: drop the create-event button
      from the events feed; add a `CreateEventButton` on `GroupDetailsCard` that pre-sets
      `groupId`/`groupName`. — _AC: events created from group page_
- [ ] 15. Add required city dropdown to event, group, and local-guide forms (validation rejects
      empty city). — _AC: city required_
- [ ] 16. Reword the local-guide entry point + wizard heading to "Register As Local Guide". — _AC: wording_
- [ ] 17. All form submit buttons render `ButtonLoader` while submitting (group form + wizard
      brought in line with the event form). — _AC: ButtonLoader on submit_
- [ ] 18. Type-check the project (`tsc`). — _Validation gate_

- [x] 11. Type-check the project (`tsc`). — _Validation gate_
