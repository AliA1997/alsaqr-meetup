import agent from '@utils/api/common';
import { makeAutoObservable, action, runInAction } from 'mobx';
import { PagingParams } from '@models/common';
import { ProfileUser } from 'typings';

export default class UserStore {
    currentUserProfile: ProfileUser | undefined = undefined;
    loadingInitial: boolean = false;
    loadingPosts: boolean = false;
    loadingFollow: boolean = false;
    pagingParams = new PagingParams();
    constructor() {
        makeAutoObservable(this);
    }

    setCurrentUserProfile = (userProfileValue: ProfileUser | undefined) => {
        this.currentUserProfile = userProfileValue;
    }
    setLoadingInitial = (val: boolean) => {
        this.loadingInitial = val;
    };
    setLoadingPosts = (val: boolean) => {
        this.loadingPosts = val;
    };

    setPagingParams = (val: PagingParams) => {
        this.pagingParams = val;
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append("currentPage", this.pagingParams.currentPage.toString());
        params.append("itemsPerPage", this.pagingParams.itemsPerPage.toString());

        return params;
    }

    loadProfile = async (username: string) => {

        this.setLoadingInitial(true);
        let profile;
        try {
            const user = await agent.userApiClient.getUserProfile(username);

            runInAction(() => {
                this.setCurrentUserProfile(user);
            });
            profile = user;
        } finally {
            this.setLoadingInitial(false);
        }
        return profile;
    }
    navigateBackToHome = action(() => {
        window.location.href = `${import.meta.env.VITE_PUBLIC_BASE_URL}/`;
    });


}
