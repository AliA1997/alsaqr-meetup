
export interface LocalGuideRecord {
    id: number;
    slug: string;
    userId: string;
    username: string;
    avatar: string;
    name: string;
    hostedCities: {
        city: string;
        stateOrProvince: string;
        country: string;
        latitude: number;
        longitude: number;
    }[];
    distanceKm: number;
}


export interface LocalGuideDetailsRecord extends LocalGuideRecord {
    userInfo: any;
    citiesHosted: any[];
}

export interface HostedCity {
    city: string;
    stateOrProvince: string;
    country: string;
    latitude?: number;
    longitude?: number;
}

// Create/update payload for a local-guide profile. Pre-filled from the logged-in
// user's profile in the wizard. `id` present => update existing guide.
export interface UpsertLocalGuideRequest {
    id?: number;
    name: string;
    bio?: string;
    email?: string;
    phone?: string;
    countryOfOrigin?: string;
    hostedCities: HostedCity[];
}
