// A selectable city, loaded once from `GET /api/Cities` and reused by the create/update
// forms' cities dropdown (event, group, local guide).
export interface City {
    id: string;
    name: string;
    stateOrProvince?: string;
    country: string;
    latitude?: number;
    longitude?: number;
}
