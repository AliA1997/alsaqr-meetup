import axios from "axios";
import { axiosResponseBody } from "./common";
import { UpsertEventRequest } from "@models/event";

export const eventsApiClient = {
    getNearbyEvents: (params: URLSearchParams | undefined) =>
        axios.get(`/api/Events`, { params }).then(axiosResponseBody),
    getOnlineEvents: (params: URLSearchParams | undefined) =>
        axios.get(`/api/Events/online`, { params }).then(axiosResponseBody),
    getMyEvents: (params: URLSearchParams | undefined) =>
        axios.get(`/api/Events/my`, { params }).then(axiosResponseBody),
    getEventDetails: (eventSlug: string, params: URLSearchParams) =>
        axios.get(`/api/EventDetails/${eventSlug}`, { params }).then(axiosResponseBody),
    getNearbyEventByCurrentEvent: (eventSlug: string, params: URLSearchParams) =>
        axios.get(`/api/EventDetails/${eventSlug}/nearby`, { params }).then(axiosResponseBody),
    getEventMembers: (eventSlug: string) =>
        axios.get(`/api/EventDetails/${eventSlug}/members`).then(axiosResponseBody),
    createEvent: (values: UpsertEventRequest) =>
        axios.post(`/api/Events`, {values}).then(axiosResponseBody),
    updateEvent: (eventId: string, values: UpsertEventRequest) =>
        axios.put(`/api/Events/${eventId}`, {values}).then(axiosResponseBody),
    deleteEvent: (eventId: string) =>
        axios.delete(`/api/Events/${eventId}`).then(axiosResponseBody),
    // Join/leave event as loggedin user.
    joinEvent: (eventId: string) =>
        axios.post(`/api/Events/${eventId}/join`).then(axiosResponseBody),
    leaveEvent: (eventId: string) =>
        axios.post(`/api/Events/${eventId}/leave`).then(axiosResponseBody),
    // Get event attendees
    // getEventAttendees: (eventId: string) =>
    //     axios.get(`/api/Events/${eventId}/attendees`).then(axiosResponseBody),
}
