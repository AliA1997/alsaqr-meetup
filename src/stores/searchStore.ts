import { makeAutoObservable, reaction, runInAction } from "mobx";
import { UserItemToDisplay } from "@typings";
import { Pagination, PagingParams } from "@models/common";
import agent from "@utils/api/common";

export default class SearchStore {

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.searchedUsersPredicate.keys(),
            () => {
                // this.predicate.clear();
                // this.loadPosts();
            }
        );
    }


    searchUsersLoadingInitial = false;
    searchPostsLoadingInitial = false;

    loadingPost = false;
    searchedUsersPredicate = new Map();
    searchedPostsPredicate = new Map();
    setSearchedUsersPredicate = (predicate: string, value: string | number | Date | undefined) => {
        if(value) {
            this.searchedUsersPredicate.set(predicate, value);
        } else {
            this.searchedUsersPredicate.delete(predicate);
        }
    }
    searchedUsersPagingParams: PagingParams = new PagingParams(1, 25);
    searchedUsersPagination: Pagination | undefined = undefined;
    searchedPostsPagingParams: PagingParams = new PagingParams(1, 25);
    searchedPostsPagination: Pagination | undefined = undefined;

    searchUsersRegistry: Map<string, UserItemToDisplay> = new Map<string, UserItemToDisplay>();

    setSearchedUsersPagingParams = (pagingParams: PagingParams) => {
        this.searchedUsersPagingParams = pagingParams;
    }
    setSearchedUsersPagination = (value: Pagination | undefined) => {
        this.searchedUsersPagination = value;
    }

    setSearchedUser = (userId: string, user: UserItemToDisplay) => {
        this.searchUsersRegistry.set(userId, user);
    }
    setSearchUsersLoadingInitial = (value: boolean) => {
        this.searchUsersLoadingInitial = value;
    }
   
    get searchUsersAxiosParams() {
        const params = new URLSearchParams();
        params.append("currentPage", this.searchedUsersPagingParams.currentPage.toString());
        params.append("itemsPerPage", this.searchedUsersPagingParams.itemsPerPage.toString());
        this.searchedUsersPredicate.forEach((value, key) => params.append(key, value));

        return params;
    }

    loadSearchedUsers = async () => {

        this.setSearchUsersLoadingInitial(true);

        try {
            if(this.searchedUsersPagingParams.currentPage === 1)
                this.searchUsersRegistry.clear();

            const { items, pagination } = await agent.userApiClient.getUsersToAdd(this.searchUsersAxiosParams) ?? [];

            runInAction(() => {
                items.forEach((userItem: UserItemToDisplay) => {
                    this.setSearchedUser(userItem.id, userItem);
                });
            });

            this.setSearchedUsersPagination(pagination);
        } finally {
            this.setSearchUsersLoadingInitial(false);
        }

    }
 
    get searchedUsers() {
        return Array.from(this.searchUsersRegistry.values());
    }
}