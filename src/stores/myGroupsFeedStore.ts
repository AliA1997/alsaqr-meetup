import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Pagination, PagingParams } from "@models/common";
import agent from "@utils/common";
import { GroupRecord } from "@models/group";
import { store } from ".";

export default class MyGroupsFeedStore {

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

    myGroupRegistry: Map<number, GroupRecord> = new Map<number, GroupRecord>();
    myGroupToViewId: number | undefined;
    setMyGroupToViewId = (val: number) => {
        this.myGroupToViewId = val;
    }
    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }
    setPagination = (value: Pagination | undefined) => {
        this.pagination = value;
    }
    setSearchQry = (val: string) => this.predicate.set('searchQry', val);


    setMyGroup = (groupId: number, group: GroupRecord) => {
        this.myGroupRegistry.set(groupId, group);
    }

    setLoadingInitial = (value: boolean) => {
        this.loadingInitial = value;
    }

    resetFeedState = () => {
        this.predicate.clear();
        this.myGroupRegistry.clear();
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

    loadMyGroups = async () => {

        this.setLoadingInitial(true);
        try {
            const { items, pagination } = await agent.groupsApiClient.getMyGroups(this.axiosParams);

            runInAction(() => {
                items.forEach((group: GroupRecord) => {
                    this.setMyGroup(group.id, group);
                });

            });

            this.setPagination(pagination);
        } finally {
            this.setLoadingInitial(false);
        }

    }


    get myGroups() {
        return Array.from(this.myGroupRegistry.values());
    }
}