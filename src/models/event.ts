// Mirrors EventMemberDto (AlSaqr.Domain.Meetup), the read model behind
// vw_event_members. Output only — never send this back as a request body.
export interface EventMember {
    eventId: string;
    // Absent for events that aren't owned by a group.
    groupId?: string;
    userId: string;
    username?: string;
    avatar?: string;
    hobbies: string[];
    isEventOrganizer: boolean;
    isLocalGuide: boolean;
    joinedAt: string; // ISO timestamp
}

export interface EventAttendee {
    userId: string;
    username: string;
    email: string;
    avatar?: string;
    joinedAt: string; // ISO timestamp
}

export interface EventRecord {
    id: string;
    slug: string;
    name: string;
    description: string;
    images: any[];
    groupId: string;
    groupName: string;
    citiesHosted: any[];
    distanceKm: number;
    // Whether the event is held online rather than at a physical location.
    isOnline?: boolean;
    // Id of the founder of the parent group; an event may only be edited/deleted
    // by this user (event ownership is inherited from the group founder).
    groupFounderId?: string;
    // Current logged-in user's attendance status
    userAttendeeStatus?: 'attending' | 'not_attending';
}

// Create/update payload. Only `name` and `description` are required; the rest are
// optional (see spec). `id` present => update, absent => create.
export interface UpsertEventRequest {
    id?: string;
    name: string;
    description: string;
    groupId?: string;
    city: string;
    stateOrProvince?: string;
    images?: string[];
    // Marks the event as online (no physical venue) when true.
    isOnline?: boolean;
}
