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
    getEventDetails: (eventId: number, params: URLSearchParams) =>
        axios.get(`/api/EventDetails/${eventId}`, { params }).then(axiosResponseBody),
    getNearbyEventByCurrentEvent: (eventId: number, params: URLSearchParams) =>
        axios.get(`/api/EventDetails/${eventId}/nearby`, { params }).then(axiosResponseBody),
    createEvent: (values: UpsertEventRequest) =>
        axios.post(`/api/Events`, {values}).then(axiosResponseBody),
    updateEvent: (eventId: number, values: UpsertEventRequest) =>
        axios.put(`/api/Events/${eventId}`, {values}).then(axiosResponseBody),
    deleteEvent: (eventId: number) =>
        axios.delete(`/api/Events/${eventId}`).then(axiosResponseBody),
}
