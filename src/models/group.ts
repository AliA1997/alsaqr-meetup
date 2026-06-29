
export interface GroupRecord {
    id: number;
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
}

// Create/update payload. Only `name` and `description` are required; the rest are
// optional (see spec). `id` present => update, absent => create.
export interface UpsertGroupRequest {
    id?: number;
    name: string;
    description: string;
    hqCity?: string;
    topics?: string[];
    images?: string[];
}
