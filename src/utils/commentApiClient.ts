import axios from "axios";
import { axiosRequests, axiosResponseBody } from "./common";
import { CommentForm } from "typings";
import { LikedCommentParams, RePostCommentParams } from "@typings";

export const commentApiClient = {
    addComment: (values: CommentForm) =>
        axiosRequests.post(`/api/comments`, { values }).then(axiosResponseBody),
    getCommentsForPost: (params: URLSearchParams | undefined, postId: string) =>
        axios.get(`/api/posts/${postId}/comments`, { params }).then(axiosResponseBody),
    getCommentsById: (commentId: string) =>
        axios.get(`/api/comments/${commentId}`).then(axiosResponseBody),
    likedComment: (commentId: string, values: LikedCommentParams) =>
        axiosRequests.patch(`/api/comments/${commentId}/liked`, { values }).then(axiosResponseBody),
    rePostComment: (commentId: string, values: RePostCommentParams) =>
        axiosRequests.patch(`/api/comments/${commentId}/repost`, { values }).then(axiosResponseBody),
    deleteComment: (commentId: string) =>
        axiosRequests.del(`/api/comments/${commentId}`).then(axiosResponseBody),
};