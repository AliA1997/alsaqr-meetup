import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Pagination, PagingParams } from "@models/common";
import agent from "@utils/common";
import { store } from ".";
import { EventRecord } from "@models/event";

export default class OnlineEventsFeedStore {

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {}
        );
    }


    loadingInitial = false;
    predicate = new Map();
    setPredicate = (predicate: string, value: string | number | Date | undefined) => {
        if(value) {
            this.predicate.set(predicate, value);
        } else {
            this.predicate.delete(predicate);
        }
    }
    pagingParams: PagingParams = new PagingParams(1, 25);
    pagination: Pagination | undefined = undefined;

    onlineEventRegistry: Map<number, EventRecord> = new Map<number, EventRecord>();

    onlineEventToViewId: number | undefined;
    setOnlineEventToViewId = (val: number) => {
        this.onlineEventToViewId = val;
    }
    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }
    setPagination = (value: Pagination | undefined) => {
        this.pagination = value;
    }
    setSearchQry = (val: string) => this.predicate.set('searchQry', val);


    setOnlineEvent = (eventId: number, event: EventRecord) => {
        this.onlineEventRegistry.set(eventId, event);
    }

    setLoadingInitial = (value: boolean) => {
        this.loadingInitial = value;
    }

    resetFeedState = () => {
        this.predicate.clear();
        this.onlineEventRegistry.clear();
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append("currentPage", this.pagingParams.currentPage.toString());
        params.append("itemsPerPage", this.pagingParams.itemsPerPage.toString());
        params.append("latitude", store.commonStore.userIpInfo?.latitude?.toString() ?? "27.7671");
        params.append("longitude", store.commonStore.userIpInfo?.longitude?.toString() ?? "82.6384");

        this.predicate.forEach((value, key) => params.append(key, value));

        return params;
    }

    loadOnlineEvents = async () => {

        this.setLoadingInitial(true);
        try {
            const { items, pagination } = await agent.eventsApiClient.getOnlineEvents(this.axiosParams);

            runInAction(() => {
                items.forEach((event: EventRecord) => {
                    this.setOnlineEvent(event.id, event);
                });

            });

            this.setPagination(pagination);
        } finally {
            this.setLoadingInitial(false);
        }

    }


    get onlineEvents() {
        return Array.from(this.onlineEventRegistry.values());
    }

}