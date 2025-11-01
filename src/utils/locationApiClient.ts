import axios from "axios";
import { axiosResponseBody } from "./common";

export const locationApiClient = {
    getIpAddress: () =>
        axios.get(import.meta.env.VITE_PUBLIC_IP_LOC_API).then(axiosResponseBody),
}