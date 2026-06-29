export interface EventRecord {
    id: number;
    slug: string;
    name: string;
    description: string;
    images: any[];
    groupId: number;
    groupName: string;
    citiesHosted: any[];
    distanceKm: number;
    // Whether the event is held online rather than at a physical location.
    isOnline?: boolean;
    // Id of the founder of the parent group; an event may only be edited/deleted
    // by this user (event ownership is inherited from the group founder).
    groupFounderId?: string;
}

// Create/update payload. Only `name` and `description` are required; the rest are
// optional (see spec). `id` present => update, absent => create.
export interface UpsertEventRequest {
    id?: number;
    name: string;
    description: string;
    groupId?: number;
    city: string;
    stateOrProvince?: string;
    images?: string[];
    // Marks the event as online (no physical venue) when true.
    isOnline?: boolean;
}
