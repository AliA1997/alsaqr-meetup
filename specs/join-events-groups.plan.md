# Technical Plan: Join Events & Groups

## Overview
This plan translates the spec into implementation details, mapping spec requirements to features, routes, components, and API calls.

## Routes & Features
- **GroupDetails** (`/group/:slug`): Add join/leave button, admin UI for founder to view & manage members
- **EventDetails** (`/event/:slug`): Add join/leave button, admin UI for group founder to view & manage members
- **GroupDetailsCard** (component): Display join/leave action button
- **New component**: `GroupMembers` - shows members list with join timestamps (founder-only view)
- **New component**: `EventMembers` - shows event attendees with join timestamps (founder-only view)
- **New component**: `JoinGroupButton` - reusable join/leave button for groups
- **New component**: `JoinEventButton` - reusable join/leave button for events

## Data Models

### Group-related additions
**GroupRecord** needs optional field:
- `userMembershipStatus?: 'joined' | 'not_joined'` (from backend to know current user's status)
- `attendees`: already exists, will include full member objects with timestamps

**New type**: `GroupMember`
```typescript
interface GroupMember {
  userId: string;
  username: string;
  email: string;
  avatar?: string;
  joinedAt: string; // ISO timestamp
}
```

### Event-related additions
**EventRecord** needs optional field:
- `userAttendanceStatus?: 'attending' | 'not_attending'` (from backend)
- `attendees`: will include full attendee objects with timestamps

**New type**: `EventAttendee`
```typescript
interface EventAttendee {
  userId: string;
  username: string;
  email: string;
  avatar?: string;
  joinedAt: string; // ISO timestamp
}
```

## API Calls

### groupsApiClient additions
```typescript
joinGroup: (groupId: number) =>
  axios.post(`/api/Groups/${groupId}/join`).then(axiosResponseBody),
leaveGroup: (groupId: number) =>
  axios.delete(`/api/Groups/${groupId}/join`).then(axiosResponseBody),
getGroupMembers: (groupId: number) =>
  axios.get(`/api/Groups/${groupId}/members`).then(axiosResponseBody),
removeGroupMember: (groupId: number, userId: string) =>
  axios.delete(`/api/Groups/${groupId}/members/${userId}`).then(axiosResponseBody),
removeEventMember: (groupId: number, eventId: number, userId: string) =>
  axios.delete(`/api/Groups/${groupId}/events/${eventId}/attendees/${userId}`).then(axiosResponseBody),
```

### eventsApiClient additions
```typescript
joinEvent: (eventId: number) =>
  axios.post(`/api/Events/${eventId}/attend`).then(axiosResponseBody),
leaveEvent: (eventId: number) =>
  axios.delete(`/api/Events/${eventId}/attend`).then(axiosResponseBody),
getEventAttendees: (eventId: number) =>
  axios.get(`/api/Events/${eventId}/attendees`).then(axiosResponseBody),
```

## Component Reuse & New Components

### Reused from common/
- `Buttons.tsx`: `InfoButton` for join/leave button styling
- `CustomLoader.tsx`: `ButtonLoader` for async state
- `Modal.tsx`: For confirmation dialogs if needed
- `Tabs.tsx`: Could be used in admin view to switch between members/events

### New Components to Create

**`JoinGroupButton.tsx`** (in `src/components/group/`)
```
Props:
  - groupId: number
  - isJoined: boolean
  - onJoinSuccess: () => void
  - disabled?: boolean

Behavior:
  - Shows "Leave" if joined, "Join" if not
  - Posts/deletes to `/api/Groups/{id}/join`
  - Shows loading state during request
  - Calls onJoinSuccess on completion
  - Auth: included via axios interceptor (bearer token)
```

**`JoinEventButton.tsx`** (in `src/components/event/`)
```
Props:
  - eventId: number
  - isAttending: boolean
  - onAttendanceChange: () => void
  - disabled?: boolean

Behavior:
  - Shows "Leave" if attending, "Join" if not
  - Posts/deletes to `/api/Events/{id}/attend`
  - Shows loading state
  - Calls onAttendanceChange on completion
  - Auth: included via axios interceptor
```

**`GroupMembers.tsx`** (in `src/components/group/`)
```
Props:
  - groupId: number
  - canManage: boolean (only if founder)
  - onMemberRemoved: () => void

Behavior:
  - Fetches members list via groupsApiClient.getGroupMembers()
  - Displays members with name, avatar, joined timestamp
  - If canManage, shows "Remove" button for each member
  - On remove, calls groupsApiClient.removeGroupMember()
  - Shows confirmation modal before removing
```

**`EventMembers.tsx`** (in `src/components/event/`)
```
Props:
  - eventId: number
  - groupId: number
  - canManage: boolean (only if group founder)
  - onAttendeeRemoved: () => void

Behavior:
  - Fetches attendees via eventsApiClient.getEventAttendees()
  - Displays attendees with name, avatar, joined timestamp
  - If canManage, shows "Remove" button for each attendee
  - On remove, calls groupsApiClient.removeEventMember()
  - Shows confirmation modal before removing
```

## Store Changes

**groupFeedStore.tsx** additions:
```typescript
// Loading states
loadingJoinLeave = false;
setLoadingJoinLeave = (value: boolean) => { this.loadingJoinLeave = value; }

// Join/leave operations
joinGroup = async (groupId: number) => {
  this.setLoadingJoinLeave(true);
  try {
    await agent.groupsApiClient.joinGroup(groupId);
    runInAction(() => {
      const group = this.groupRegistry.get(groupId);
      if (group) {
        group.userMembershipStatus = 'joined';
        this.setGroup(groupId, group);
      }
    });
  } finally {
    this.setLoadingJoinLeave(false);
  }
}

leaveGroup = async (groupId: number) => {
  // Similar to joinGroup but sets status to 'not_joined'
}
```

Similar additions for **eventsFeedStore.tsx** with `joinEvent` and `leaveEvent`.

## Auth & Permissions

- **Bearer token**: All join/leave endpoints require authentication via header already managed by axios interceptor
- **Founder-only UI**: Check `isFounder = authStore.currentSessionUser?.id === group.founderId`
- **Visibility rule**: Show admin UI (members list, remove buttons) only if logged-in user is the founder

## Styling Notes

- Use Tailwind utility classes (already done in reference code)
- Reuse color scheme from reference: `hover:text-red-400` for leave, `hover:text-[#55a8c2]` for join
- Icons: Use `PlusCircleIcon` from `@heroicons/react/outline` for join button
- Status badges: Use `TagOrLabel` component with appropriate colors

## Acceptance Criteria Mapping

| Spec Requirement | Implementation | Testable Via |
|---|---|---|
| User joins group | JoinGroupButton + groupFeedStore.joinGroup + API | GroupDetailsCard shows "Leave" button after join |
| User leaves group | JoinGroupButton + groupFeedStore.leaveGroup + API | GroupDetailsCard shows "Join" button after leave |
| User joins event | JoinEventButton + eventsFeedStore.joinEvent + API | EventDetailsCard shows "Leave" button after join |
| User leaves event | JoinEventButton + eventsFeedStore.leaveEvent + API | EventDetailsCard shows "Join" button after leave |
| Founder sees members | GroupMembers component fetches via API | GroupDetailsCard shows members list (founder-only) |
| Founder removes member | GroupMembers component + removeGroupMember API | Member disappears from list after removal |
| Founder sees events | Already exists (EventDetails in GroupDetails) | Displayed in Marquee component |
| Founder removes event attendee | EventMembers component + removeEventMember API | Attendee disappears from list |
| Non-founder can't see admin UI | Conditional rendering based on isFounder | Admin UI hidden for non-founders |
| Can't join twice | API validates + UI disables button | "Leave" button shown when already joined |

## Constitution Compliance

- **Two-bucket architecture**: Uses existing GroupDetails feature (page/route owner) and creates reusable components in `components/group/` and `components/event/`
- **Props interfaces**: Each component has `XxxProps` interface
- **Auth**: Bearer token passed via axios interceptor; no manual header setup
- **Forms**: No forms needed for join/leave actions
- **Styling**: All Tailwind utilities, extracted repeated patterns
- **TypeScript**: Strict types throughout, no `any`
