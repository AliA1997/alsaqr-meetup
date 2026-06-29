import axios from "axios";
import { axiosResponseBody } from "./common";
import { UpsertGroupRequest } from "@models/group";

export const groupsApiClient = {
    getNearbyGroups: (params: URLSearchParams | undefined) =>
        axios.get(`/api/Groups`, { params }).then(axiosResponseBody),
    getMyGroups: (params: URLSearchParams | undefined) =>
        axios.get(`/api/Groups/my`, { params }).then(axiosResponseBody),
    getGroupDetails: (groupId: number, params: URLSearchParams | undefined) =>
        axios.get(`/api/GroupDetails/${groupId}`, { params }).then(axiosResponseBody),
    getSimilarGroups: (groupId: number, params: URLSearchParams | undefined) =>
        axios.get(`/api/GroupDetails/${groupId}/similar`, { params }).then(axiosResponseBody),
    createGroup: (values: UpsertGroupRequest) =>
        axios.post(`/api/Groups`, {values}).then(axiosResponseBody),
    updateGroup: (groupId: number, values: UpsertGroupRequest) =>
        axios.put(`/api/Groups/${groupId}`, {values}).then(axiosResponseBody),
    deleteGroup: (groupId: number) =>
        axios.delete(`/api/Groups/${groupId}`).then(axiosResponseBody),
    // Canonical topic list backing the group form's topic autocomplete.
    getTopics: () =>
        axios.get(`/api/Topics`).then(axiosResponseBody),
}
