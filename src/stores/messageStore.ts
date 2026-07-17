import { makeAutoObservable, runInAction } from "mobx";
import { MessageFormDto, MessageHistoryToDisplay, MessageToDisplay, ProfileUser } from "@typings";
import { Pagination, PagingParams } from "@models/common";
import agent from "@utils/api/common";

export default class MessageStore {
    constructor() {
        makeAutoObservable(this);
    }
    loadingInitial = false;
    loadingUpsert = false;
    loadingHistory = false;
    predicate = new Map();
    setPredicate = (predicate: string, value: string | number | Date | undefined) => {
        if(value) {
            this.predicate.set(predicate, value);
        } else {
            this.predicate.delete(predicate);
        }
    }
    pagingParams: PagingParams = new PagingParams(1, 10);
    historyPagingParams: PagingParams = new PagingParams(1, 25);
    pagination: Pagination | undefined = undefined;
    historyPagination: Pagination | undefined = undefined;
    currentProfileToMessage: ProfileUser | undefined = undefined;
    directMessageRegistry: Map<string, MessageToDisplay> = new Map<string, MessageToDisplay>();

    directMessageHistoryRegistry: Map<string, MessageHistoryToDisplay> = new Map<string, MessageHistoryToDisplay>();
    selectedDirectMessageHistoryItem: MessageHistoryToDisplay | undefined;

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }
    setPagination = (value: Pagination | undefined) => {
        this.pagination = value;
    }
    setHistoryPagingParams = (pagingParams: PagingParams) => {
        this.historyPagingParams = pagingParams;
    }
    setHistoryPagination = (value: Pagination | undefined) => {
        this.historyPagination = value;
    }
    setLoadingInitial = (value: boolean) => {
        this.loadingInitial = value;
    }
    setLoadingUpsert = (val: boolean) => {
        this.loadingUpsert = val;
    }
    setLoadingHistory = (val: boolean) => {
        this.loadingHistory = val;
    }
    setDirectMessage = (message: MessageToDisplay) => {
        this.directMessageRegistry.set(message.messageId, message);
    }

    setDirectMessageHistory = (messageHistory: MessageHistoryToDisplay) => {
        this.directMessageHistoryRegistry.set(messageHistory.receiverId, messageHistory);
    }
    setSelectedDirectMessageHistoryItem = (val: MessageHistoryToDisplay | undefined) => {
        this.directMessageRegistry.clear();
        this.selectedDirectMessageHistoryItem = val;
    }

    resetFeedState = () => {
        this.predicate.clear();
    }

    setCurrentProfileToMessage = (val: ProfileUser | undefined) => {
        this.currentProfileToMessage = val;
    }
    get axiosParams() {
        const params = new URLSearchParams();
        params.append("currentPage", this.pagingParams.currentPage.toString());
        params.append("itemsPerPage", this.pagingParams.itemsPerPage.toString());
        this.predicate.forEach((value, key) => params.append(key, value));

        return params;
    }

    loadDirectMessages = async (senderId: string, receiverId: string) => {
        this.setLoadingInitial(true);
        this.directMessageRegistry.clear();
        try {
            this.predicate.set('senderId', senderId);
            this.predicate.set('receiverId', receiverId);

            const { items, pagination } = await agent.messageApiClient.loadDirectMessages(this.axiosParams);

            runInAction(() => {
                items.map((messageItem: MessageToDisplay) => this.setDirectMessage(messageItem));
            })

            this.setPagination(pagination);
        } finally {
            this.setLoadingInitial(false);
        }

    }

    loadDirectMessageHistory = async () => {

        this.setLoadingHistory(true);

        this.directMessageHistoryRegistry.clear();
        try {

            const { items, pagination } = await agent.messageApiClient.loadDirectMessageThreads(this.axiosParams);

            runInAction(() => {
                items.map((messageItem: MessageHistoryToDisplay) => this.setDirectMessageHistory(messageItem));
            })

            this.setPagination(pagination);
        } finally {
            this.setLoadingHistory(false);
        }

    }

    sendDirectMessage = async (messageForm: MessageFormDto) => {
        this.setLoadingUpsert(true);
        try {
            await agent.messageApiClient.sendDirectMessage(messageForm);

        } finally {
            this.setLoadingUpsert(false);
        }
    }

    get directMessages() {
        return Array.from(this.directMessageRegistry.values());
    }

    get directMessageHistory() {
        return Array.from(this.directMessageHistoryRegistry.values());
    }
}