
export interface LocalGuideRecord {
    id: number;
    slug: string;
    userId: string;
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
}
