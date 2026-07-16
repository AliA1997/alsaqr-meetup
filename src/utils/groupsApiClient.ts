import axios from "axios";
import { axiosResponseBody } from "./common";
import { UpsertGroupRequest } from "@models/group";

export const groupsApiClient = {
    getNearbyGroups: (params: URLSearchParams | undefined) =>
        axios.get(`/api/Groups`, { params }).then(axiosResponseBody),
    getMyGroups: (params: URLSearchParams | undefined) =>
        axios.get(`/api/Groups/my`, { params }).then(axiosResponseBody),
    getGroupDetails: (groupId: string, params: URLSearchParams | undefined) =>
        axios.get(`/api/GroupDetails/${groupId}`, { params }).then(axiosResponseBody),
    getSimilarGroups: (groupId: string, params: URLSearchParams | undefined) =>
        axios.get(`/api/GroupDetails/${groupId}/similar`, { params }).then(axiosResponseBody),
    createGroup: (values: UpsertGroupRequest) =>
        axios.post(`/api/Groups`, {values}).then(axiosResponseBody),
    updateGroup: (groupId: string, values: UpsertGroupRequest) =>
        axios.put(`/api/Groups/${groupId}`, {values}).then(axiosResponseBody),
    deleteGroup: (groupId: string) =>
        axios.delete(`/api/Groups/${groupId}`).then(axiosResponseBody),
    // Canonical topic list backing the group form's topic autocomplete.
    getTopics: () =>
        axios.get(`/api/Topics`).then(axiosResponseBody),
    // Join/leave group
    joinGroup: (groupId: string) =>
        axios.post(`/api/Groups/${groupId}/join`).then(axiosResponseBody),
    leaveGroup: (groupId: string, userId: string) =>
        axios.delete(`/api/Groups/${groupId}/members/${userId}`).then(axiosResponseBody),
    // Get group members
    // getGroupMembers: (groupId: number) =>
    //     axios.get(`/api/Groups/${groupId}/attendee`).then(axiosResponseBody),
    // Remove member from group
    // removeGroupMember: (groupId: number, userId: string) =>
    //     axios.delete(`/api/Groups/${groupId}/members/${userId}`).then(axiosResponseBody),
    // Remove attendee from event in group
    removeEventMember: (eventId: string, userId: string) =>
        axios.delete(`/api/Events/${eventId}/members/${userId}`).then(axiosResponseBody),
}
