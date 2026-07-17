import axios from "axios";
import { axiosResponseBody } from "./common";

export const locationApiClient = {
    getIpAddress: () =>
        axios.get(import.meta.env.VITE_PUBLIC_IP_LOC_API).then(axiosResponseBody),
    reverseLocateAddress: (lat: number, long: number) =>
        axios.get(`${import.meta.env.VITE_PUBLIC_REVERSE_LOC_API}?lat=${lat}&lon=${long}&format=geojson`).then(axiosResponseBody),
}