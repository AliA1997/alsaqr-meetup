import { useContext, createContext } from 'react';
import CommonStore from './commonStore';
import ModalStore from './modalStore';
import AuthStore from './authStore';
import NotificationStore from './notificationStore';
import UserStore from './userStore';
import MessageStore from './messageStore';
import CommentFeedStore from './commentFeedStore';
import SettingsStore from './settingsStore';
import SearchStore from './searchStore';
import GroupsFeedStore from './groupFeedStore';
import EventsFeedStore from './eventsFeedStore';
import MyGroupsFeedStore from './myGroupsFeedStore';
import OnlineEventsFeedStore from './onlineEventsFeedStore';
import MyEventsFeedStore from './myEventsFeedStore';
import LocalGuidesFeedStore from './localGuidesFeedStore';

interface Store {
    authStore: AuthStore;
    commentFeedStore: CommentFeedStore;
    commonStore: CommonStore;
    groupsFeedStore: GroupsFeedStore;
    myGroupsFeedStore: MyGroupsFeedStore;
    eventsFeedStore: EventsFeedStore;
    localGuidesFeedStore: LocalGuidesFeedStore;
    onlineEventsFeedStore: OnlineEventsFeedStore;
    myEventsFeedStore: MyEventsFeedStore;
    modalStore: ModalStore;
    messageStore: MessageStore;
    notificationStore: NotificationStore;
    searchStore: SearchStore;
    settingsStore: SettingsStore;
    userStore: UserStore;
}


export enum FilterKeys {
  Search = 'search',
  SearchUsers = 'search-users',
  SearchPosts = 'search-posts',
  MyBookmarks = "my-bookmarks",
  Explore = 'explore',
  Normal = 'normal',
  Lists = "lists",
  Community = "community",
  CommunityDiscussion = "community-discussion",
  Register = "register"
}


export const store: Store = {
    authStore: new AuthStore(),
    commonStore: new CommonStore(),
    commentFeedStore: new CommentFeedStore(),
    groupsFeedStore: new GroupsFeedStore(),
    myGroupsFeedStore: new MyGroupsFeedStore(),
    eventsFeedStore: new EventsFeedStore(),
    localGuidesFeedStore: new LocalGuidesFeedStore(),
    onlineEventsFeedStore: new OnlineEventsFeedStore(),
    myEventsFeedStore: new MyEventsFeedStore(),
    modalStore: new ModalStore(),
    messageStore: new MessageStore(),
    notificationStore: new NotificationStore(),
    searchStore: new SearchStore(),
    settingsStore: new SettingsStore(),
    userStore: new UserStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}
