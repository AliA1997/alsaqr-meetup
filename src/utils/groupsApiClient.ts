import axios from "axios";
import { axiosResponseBody } from "./common";

export const groupsApiClient = {
    getNearbyGroups: (params: URLSearchParams | undefined) =>
        axios.get(`/api/Groups`, { params }).then(axiosResponseBody),
    getMyGroups: (params: URLSearchParams | undefined) =>
        axios.get(`/api/Groups/my`, { params }).then(axiosResponseBody),
    getGroupDetails: (groupId: number, params: URLSearchParams | undefined) =>
        axios.get(`/api/Groups/${groupId}/details`, { params }).then(axiosResponseBody),
}