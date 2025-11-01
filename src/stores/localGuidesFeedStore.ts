import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Pagination, PagingParams } from "@models/common";
import agent from "@utils/common";
import { store } from ".";
import { LocalGuideRecord } from "@models/localGuide";

export default class LocalGuidesFeedStore {

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

    localGuidesRegistry: Map<number, LocalGuideRecord> = new Map<number, LocalGuideRecord>();
    localGuideToViewId: number | undefined;
    setLocalGuideToViewId = (val: number) => {
        this.localGuideToViewId = val;
    }
    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }
    setPagination = (value: Pagination | undefined) => {
        this.pagination = value;
    }
    setSearchQry = (val: string) => this.predicate.set('searchQry', val);


    setLocalGuide = (localGuideId: number, localGuide: LocalGuideRecord) => {
        this.localGuidesRegistry.set(localGuideId, localGuide);
    }

    setLoadingInitial = (value: boolean) => {
        this.loadingInitial = value;
    }

    resetFeedState = () => {
        this.predicate.clear();
        this.localGuidesRegistry.clear();
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

    loadLocalGuides = async () => {

        this.setLoadingInitial(true);
        try {
            const { items, pagination } = await agent.userApiClient.getLocalGuides(this.axiosParams);

            runInAction(() => {
                items.forEach((localGuide: LocalGuideRecord) => {
                    this.setLocalGuide(localGuide.id, localGuide);
                });

            });

            this.setPagination(pagination);
        } finally {
            this.setLoadingInitial(false);
        }

    }


    get nearbyLocalGuides() {
        return Array.from(this.localGuidesRegistry.values());
    }
}