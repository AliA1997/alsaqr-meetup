
// Mirrors GroupMemberDto (AlSaqr.Domain.Meetup), the read model behind
// vw_group_members. Output only — never send this back as a request body.
export interface GroupMember {
    id: string;
    groupId: string;
    userId: string;
    username?: string;
    avatar?: string;
    hobbies: string[];
    isGroupOrganizer: boolean;
    isLocalGuide: boolean;
    joinedAt: string; // ISO timestamp
}

export interface GroupRecord {
    id: string;
    slug: string;
    name: string;
    description: string;
    images: any[];
    cityId: string;
    city: string;
    country: string;
    topics: any[];
    attendees: any[];
    longitude: number;
    latitude: number;
    distanceKm: number;
    // Id of the user who founded the group; only the founder may edit/delete it.
    founderId?: string;
    founderUsername?: string;
    founderAvatar?: string;
    // Current logged-in user's membership status
    userMembershipStatus?: 'joined' | 'not_joined';
}

// Create/update payload. Only `name` and `description` are required; the rest are
// optional (see spec). `id` present => update, absent => create.
export interface UpsertGroupRequest {
    id?: string;
    name: string;
    description: string;
    hqCity?: string;
    topics?: string[];
    images?: string[];
}
