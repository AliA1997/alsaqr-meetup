import axios from "axios";
import { MessageFormDto } from "typings";
import { axiosResponseBody } from "./common";


export const messageApiClient = {
    loadDirectMessages: (
        params: URLSearchParams,
    ) =>
        axios.get(`/api/users/messages`, { params }).then(axiosResponseBody),
    sendDirectMessage: (
        values: MessageFormDto
    ) =>
        axios.post(`/api/messages/sendMessage`, { values }).then(axiosResponseBody),
    loadDirectMessageThreads: (
        params: URLSearchParams,
    ) =>
        axios.get(`/api/users/messageThreads`, { params }).then(axiosResponseBody),
};