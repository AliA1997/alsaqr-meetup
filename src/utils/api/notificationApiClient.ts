import axios from "axios";
import { axiosResponseBody } from "./common";

export const notificationApiClient = {
    getNotifications: (userId: string, params: URLSearchParams | undefined) =>
        axios.get(`/api/Notifications/${userId}`, { params }).then(axiosResponseBody),
}