import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Pagination, PagingParams } from "@models/common";
import agent from "@utils/common";
import { store } from ".";
import { EventRecord } from "@models/event";

export default class EventsFeedStore {

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

    eventRegistry: Map<number, EventRecord> = new Map<number, EventRecord>();

    eventToViewId: number | undefined;
    setEventToViewId = (val: number) => {
        this.eventToViewId = val;
    }
    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }
    setPagination = (value: Pagination | undefined) => {
        this.pagination = value;
    }
    setSearchQry = (val: string) => this.predicate.set('searchQry', val);


    setEvent = (eventId: number, event: EventRecord) => {
        this.eventRegistry.set(eventId, event);
    }

    setLoadingInitial = (value: boolean) => {
        this.loadingInitial = value;
    }

    resetFeedState = () => {
        this.predicate.clear();
        this.eventRegistry.clear();
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

    loadEvents = async () => {

        this.setLoadingInitial(true);
        try {
            const { items, pagination } = await agent.eventsApiClient.getNearbyEvents(this.axiosParams);

            runInAction(() => {
                items.forEach((event: EventRecord) => {
                    this.setEvent(event.id, event);
                });

            });

            this.setPagination(pagination);
        } finally {
            this.setLoadingInitial(false);
        }

    }


    get nearbyEvents() {
        return Array.from(this.eventRegistry.values());
    }

}