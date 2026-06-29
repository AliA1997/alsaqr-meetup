import axios from "axios";
import { axiosResponseBody } from "./common";
import { City } from "@models/city";

// Public list of selectable cities. Populates the dropdown shared by the event, group,
// and local-guide create/update forms.
export const citiesApiClient = {
    getCities: () =>
        axios.get(`/api/Cities`).then(axiosResponseBody),
    // Backend-reactive autocomplete source: returns only the cities matching the typed
    // query, so the create/update forms don't have to preload the whole list.
    searchCities: (params: URLSearchParams): Promise<City[]> =>
        axios.get(`/api/Cities`, { params }).then(axiosResponseBody),
    getCityById: (cityId: string) => 
        axios.get(`/api/Cities/${cityId}`).then(axiosResponseBody),
};
