# Tasks: Join Events & Groups

Execute tasks in order. Each task is independently verifiable and testable. Update this list as tasks complete.

## Models & Types (Foundation)

- [ ] Add `GroupMember` interface to `src/models/group.ts`
- [ ] Add `EventAttendee` interface to `src/models/event.ts`
- [ ] Add optional fields to `GroupRecord`: `userMembershipStatus?: 'joined' | 'not_joined'`
- [ ] Add optional fields to `EventRecord`: `userAttendanceStatus?: 'attending' | 'not_attending'`

## API Clients (Backend Integration)

- [ ] Add 4 endpoints to `groupsApiClient.ts`: `joinGroup`, `leaveGroup`, `getGroupMembers`, `removeGroupMember`, `removeEventMember`
- [ ] Add 3 endpoints to `eventsApiClient.ts`: `joinEvent`, `leaveEvent`, `getEventAttendees`

## Store Updates (State Management)

- [ ] Add `loadingJoinLeave` state and setter to `groupFeedStore.ts`
- [ ] Add `joinGroup()` and `leaveGroup()` methods to `groupFeedStore.ts`
- [ ] Add `loadingJoinLeave` state and setter to `eventsFeedStore.ts`
- [ ] Add `joinEvent()` and `leaveEvent()` methods to `eventsFeedStore.ts`

## Reusable Components

- [ ] Create `JoinGroupButton.tsx` in `src/components/group/` with join/leave toggle
- [ ] Create `JoinEventButton.tsx` in `src/components/event/` with attend/leave toggle
- [ ] Create `GroupMembers.tsx` in `src/components/group/` to display & manage members (founder-only)
- [ ] Create `EventMembers.tsx` in `src/components/event/` to display & manage attendees (founder-only)

## Feature Integration: GroupDetails

- [ ] Update `GroupDetailsCard.tsx` to import and display `JoinGroupButton`
- [ ] Update `GroupDetailsCard.tsx` to show `GroupMembers` component (founder-only)
- [ ] Verify GroupDetails page correctly shows joined status indicator

## Feature Integration: EventDetails

- [ ] Update `EventDetailsCard.tsx` to import and display `JoinEventButton`
- [ ] Update `EventDetailsCard.tsx` to show `EventMembers` component (founder-only)
- [ ] Verify EventDetails page correctly shows attendance status indicator

## Tests

- [ ] Write test: Founder can view group members list (includes join timestamps)
- [ ] Write test: Founder can remove a member from a group
- [ ] Write test: Founder can view all events for the group (already exists, verify)
- [ ] Write test: Founder can remove an attendee from an event
- [ ] Write test: User sees "Leave" button after joining a group
- [ ] Write test: Non-founder cannot see admin UI (GroupMembers hidden)
- [ ] Write test: User cannot join the same group twice
- [ ] Write test: User cannot join the same event twice

## Validation

- [ ] Build succeeds (`pnpm build`)
- [ ] Run Playwright tests: all pass
- [ ] Manual test: Join/leave group flow end-to-end
- [ ] Manual test: Join/leave event flow end-to-end
- [ ] Manual test: Founder admin UI visible only to founder
- [ ] Verify acceptance criteria from spec are all met
