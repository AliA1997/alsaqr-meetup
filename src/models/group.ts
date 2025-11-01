
export interface GroupRecord {
    id: number;
    name: string;
    description: string;
    images: any[];
    cityId: number;
    city: string;
    country: string;
    topics: any[];
    attendees: any[];
    longitude: number;
    latitude: number;
    distanceKm: number;
}