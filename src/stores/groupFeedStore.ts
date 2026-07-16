import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Pagination, PagingParams } from "@models/common";
import agent from "@utils/common";
import { GroupRecord, UpsertGroupRequest } from "@models/group";
import { store } from ".";

export default class GroupsFeedStore {

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {}
        );
    }


    loadingInitial = false;
    loadingUpsert = false;
    loadingJoinLeave = false;
    setLoadingUpsert = (value: boolean) => {
        this.loadingUpsert = value;
    }
    setLoadingJoinLeave = (value: boolean) => {
        this.loadingJoinLeave = value;
    }
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

    groupRegistry: Map<string, GroupRecord> = new Map<string, GroupRecord>();
    groupToViewId: string | undefined;
    setGroupToViewId = (val: string) => {
        this.groupToViewId = val;
    }
    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }
    setPagination = (value: Pagination | undefined) => {
        this.pagination = value;
    }
    setSearchQry = (val: string) => this.predicate.set('searchQry', val);


    setGroup = (groupId: string, group: GroupRecord) => {
        this.groupRegistry.set(groupId, group);
    }

    setLoadingInitial = (value: boolean) => {
        this.loadingInitial = value;
    }

    resetFeedState = () => {
        this.predicate.clear();
        this.groupRegistry.clear();
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append("currentPage", this.pagingParams.currentPage.toString());
        params.append("itemsPerPage", this.pagingParams.itemsPerPage.toString());
        params.append("latitude", `${store.commonStore.userIpInfo?.latitude?.toString() ?? "27.7671"}`);
        params.append("longitude", `${store.commonStore.userIpInfo?.longitude?.toString() ?? "82.6384"}`);
        params.append("maxDistanceKm", "2500.0");

        this.predicate.forEach((value, key) => params.append(key, value));

        return params;
    }

    loadGroups = async () => {

        this.setLoadingInitial(true);
        try {
            debugger;
            const { items, pagination } = await agent.groupsApiClient.getNearbyGroups(this.axiosParams);

            runInAction(() => {
                items.forEach((group: GroupRecord) => {
                    this.setGroup(group.id, group);
                });

            });

            this.setPagination(pagination);
        } finally {
            this.setLoadingInitial(false);
        }

    }


    get nearbyGroups() {
        return Array.from(this.groupRegistry.values());
    }

    createGroup = async (values: UpsertGroupRequest) => {
        this.setLoadingUpsert(true);
        try {
            await agent.groupsApiClient.createGroup(values);
        } finally {
            this.setLoadingUpsert(false);
        }
    }

    updateGroup = async (groupId: string, values: UpsertGroupRequest) => {
        this.setLoadingUpsert(true);
        try {
            await agent.groupsApiClient.updateGroup(groupId, values);
            await store.myGroupsFeedStore.loadMyGroups();
        } finally {
            this.setLoadingUpsert(false);
        }
    }

    deleteGroup = async (groupId: string) => {
        this.setLoadingUpsert(true);
        try {
            await agent.groupsApiClient.deleteGroup(groupId);
            runInAction(() => store.myGroupsFeedStore.myGroupRegistry.delete(groupId));
        } finally {
            this.setLoadingUpsert(false);
        }
    }

    joinGroup = async (groupId: string) => {
        this.setLoadingJoinLeave(true);
        try {
            await agent.groupsApiClient.joinGroup(groupId);
            runInAction(() => {
                const group = this.groupRegistry.get(groupId);
                if (group) {
                    group.userMembershipStatus = 'joined';
                    this.setGroup(groupId, group);
                }
            });
        } finally {
            this.setLoadingJoinLeave(false);
        }
    }

    leaveGroup = async (groupId: string, userId: string) => {
        this.setLoadingJoinLeave(true);
        try {
            await agent.groupsApiClient.leaveGroup(groupId, userId);
            runInAction(() => {
                const group = this.groupRegistry.get(groupId);
                if (group) {
                    group.userMembershipStatus = 'not_joined';
                    this.setGroup(groupId, group);
                }
            });
        } finally {
            this.setLoadingJoinLeave(false);
        }
    }
}