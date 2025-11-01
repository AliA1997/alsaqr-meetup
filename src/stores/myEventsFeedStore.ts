import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Pagination, PagingParams } from "@models/common";
import agent from "@utils/common";
import { store } from ".";
import { EventRecord } from "@models/event";

export default class MyEventsFeedStore {

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

    myEventRegistry: Map<number, EventRecord> = new Map<number, EventRecord>();

    myEventToViewId: number | undefined;
    setMyEventToViewId = (val: number) => {
        this.myEventToViewId = val;
    }
    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }
    setPagination = (value: Pagination | undefined) => {
        this.pagination = value;
    }
    setSearchQry = (val: string) => this.predicate.set('searchQry', val);


    setMyEvent = (eventId: number, event: EventRecord) => {
        this.myEventRegistry.set(eventId, event);
    }

    setLoadingInitial = (value: boolean) => {
        this.loadingInitial = value;
    }

    resetFeedState = () => {
        this.predicate.clear();
        this.myEventRegistry.clear();
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

    loadMyEvents = async () => {

        this.setLoadingInitial(true);
        try {
            const { items, pagination } = await agent.eventsApiClient.getMyEvents(this.axiosParams);

            runInAction(() => {
                items.forEach((event: EventRecord) => {
                    this.setMyEvent(event.id, event);
                });

            });

            this.setPagination(pagination);
        } finally {
            this.setLoadingInitial(false);
        }

    }


    get myEvents() {
        return Array.from(this.myEventRegistry.values());
    }

}