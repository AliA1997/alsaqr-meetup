import axios from "axios";
import { axiosRequests, axiosResponseBody } from "./common";

export const userApiClient = {
    sessionSignin: (email: string) => 
        axiosRequests.post(`/api/session/signin`, { values: { email } }).then(axiosResponseBody),
    sessionCheck: (email: string) => 
        axios.post(`/api/session/check `, { values: { email } }, { headers: {
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

    getUsersToAdd: (userId: string, params: URLSearchParams) =>
        axios.get(`/api/users/${userId}/usersToAdd`, { params }).then(axiosResponseBody),
    getUserProfilePosts: (username: string, params: URLSearchParams) =>
        axios.get(`/api/profile/${username}/posts`, { params }).then(axiosResponseBody),

} 