import axios from "axios";
import { axiosRequests, axiosResponseBody } from "./common";
import { UpsertLocalGuideRequest } from "@models/localGuide";

export const userApiClient = {
    sessionSignin: (email: string) => 
        axiosRequests.post(`/api/auth/signin`, { values: { email } }).then(axiosResponseBody),
    sessionCheck: (email: string) => 
        axios.post(`/api/session/check `, { values: { email } }, { headers: {
            "Content-Type": "application/json"
        }}).then(axiosResponseBody),
        
    // Web3 wallet auth mirrors the oauth flow: signin upserts the wallet user,
    // check returns the session user keyed by wallet address instead of email.
    web3SessionSignin: (web3Address: string) =>
        axios.post(`/api/auth/signin`, { values: { web3_address: web3Address, provider: "web3" } }, { headers: {
            "Content-Type": "application/json"
        }}).then(axiosResponseBody),
    web3SessionCheck: (web3Address: string) =>
        axios.post(`/api/Session/check `, { values: { web3_address: web3Address, email: "" } }, { headers: {
            "Content-Type": "application/json"
        }}).then(axiosResponseBody),
    getLocalGuides: (params: URLSearchParams) => 
        axios.get(`/api/LocalGuides`, { params }).then(axiosResponseBody),

    getLocalGuideDetails: (localGuideId: number, params: URLSearchParams) => 
        axios.get(`/api/LocalGuideDetails/${localGuideId}`, { params }).then(axiosResponseBody),

    getNearbyLocalGuidesByCurrentLocalGuide: (localGuideId: number, params: URLSearchParams) => 
        axios.get(`/api/LocalGuideDetails/${localGuideId}/nearby`, { params }).then(axiosResponseBody),
    getUserProfile: (username: string) => 
        axios.get(`/api/profile/${username}`).then(axiosResponseBody),
    getUsersToAdd: (params: URLSearchParams) =>
        axios.get(`/api/Users/usersToAdd`, { params }).then(axiosResponseBody),
    getUserProfilePosts: (username: string, params: URLSearchParams) =>
        axios.get(`/api/profile/${username}/posts`, { params }).then(axiosResponseBody),

    createLocalGuide: (values: UpsertLocalGuideRequest) =>
        axios.post(`/api/LocalGuides`, values).then(axiosResponseBody),
    updateLocalGuide: (localGuideId: number, values: UpsertLocalGuideRequest) =>
        axios.put(`/api/LocalGuides/${localGuideId}`, values).then(axiosResponseBody),
}