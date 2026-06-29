import { useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@stores/index";
import { GroupRecord } from "@models/group";
import { EventRecord } from "@models/event";
import Tabs from "@common/Tabs";
import { OptimizedImage } from "@common/Image";
import { CommonLink } from "@common/Links";
import GroupCard from "@components/group/GroupCard";
import EventCard from "@components/event/EventCard";
import GroupOwnerActions from "@components/group/GroupOwnerActions";
import EventOwnerActions from "@components/event/EventOwnerActions";
import CreateEntityButton from "@common/CreateEntityButton";
import { TypeOfFeeds } from "@models/enums";

// Public AlSaqr social profile host. The dashboard links a member back to their main
// AlSaqr identity at `<alsaqr>/users/<username>`.
const ALSAQR_PROFILE_BASE = `${import.meta.env.VITE_PUBLIC_ALSAQR_URL}/users`;

const GROUPS_TAB = "groups";
const EVENTS_TAB = "events";

// Route page (`/admin`) where a logged-in member manages the groups and events they
// founded. Mirrors the MainProfile layout (header + Tabs), reuses the already-loaded
// "my" feed registries (loads only when empty), and the existing owner-gated edit/delete
// controls — no new mutation UI.
const AdminDashboard = observer(() => {
    const { authStore, myGroupsFeedStore, myEventsFeedStore } = useStore();
    const { currentSessionUser } = authStore;

    // Load the first tab's data on mount; the rest is lazy-loaded on tab switch.
    useEffect(() => {
        if (myGroupsFeedStore.myGroups.length === 0) myGroupsFeedStore.loadMyGroups();
    }, [myGroupsFeedStore]);

    const userId = currentSessionUser?.id;
    // Only surface records the member actually founded (ownership is the founder check).
    const ownedGroups = myGroupsFeedStore.myGroups.filter((g) => g.founderId === userId);
    const ownedEvents = myEventsFeedStore.myEvents.filter((e) => e.groupFounderId === userId);

    const groupsRenderer = useCallback(
        (groups: GroupRecord[]) => (
            <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {groups.map((group) => (
                    <div key={group.id} className="flex flex-col">
                        <GroupCard group={group} showDistance testId="adminGroupCard" />
                        <GroupOwnerActions group={group} />
                    </div>
                ))}
            </div>
        ),
        []
    );

    const eventsRenderer = useCallback(
        (events: EventRecord[]) => (
            <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {events.map((event) => (
                    <div key={event.id} className="flex flex-col">
                        <EventCard event={event} showDistance testId="adminEventCard" />
                        <EventOwnerActions event={event} />
                    </div>
                ))}
            </div>
        ),
        []
    );

    const loadOnTabSwitch = useCallback(
        async (tab: string) => {
            if (tab === GROUPS_TAB && myGroupsFeedStore.myGroups.length === 0)
                await myGroupsFeedStore.loadMyGroups();
            else if (tab === EVENTS_TAB && myEventsFeedStore.myEvents.length === 0)
                await myEventsFeedStore.loadMyEvents();
        },
        [myGroupsFeedStore, myEventsFeedStore]
    );

    return (
        <div className="w-full md:col-span-7 scrollbar-hide max-h-screen overflow-scroll lg:col-span-5 dark:border-gray-800">
            <div className="mb-[7rem]">
                <div>
                    <div
                        className="w-full bg-cover bg-center bg-no-repeat"
                        style={{
                            height: "160px",
                            backgroundImage: currentSessionUser?.bgThumbnail
                                ? `url(${currentSessionUser.bgThumbnail})`
                                : undefined,
                        }}
                    />
                    <div className="relative p-4">
                        <div className="flex flex-col md:flex-row md:items-start">
                            <div className="flex flex-1 items-start justify-center md:justify-start">
                                <div className="relative -mt-20 md:-mt-24 h-24 w-24 md:h-36 md:w-36">
                                    <OptimizedImage
                                        src={currentSessionUser?.avatar ?? ""}
                                        alt={currentSessionUser?.username ?? "avatar"}
                                        loadedHeight={150}
                                        loadedWidth={150}
                                        classNames="rounded-full border-4 border-gray-900 object-cover bg-white dark:bg-black h-24 w-24 md:h-36 md:w-36"
                                    />
                                </div>
                            </div>
                            <div className="flex shrink-0 items-start justify-center lg:justify-end">
                                {currentSessionUser ? (
                                    <>
                                    <CommonLink
                                        testId="alsaqrProfileLink"
                                        animatedLink={false}
                                        classNames="border border-[0.1rem] hover:text-[#55a8c2] text-md lg:text-lg"
                                        onClick={() =>
                                            window.open(
                                                `${ALSAQR_PROFILE_BASE}/${currentSessionUser.username}`,
                                                "_blank",
                                                "noopener,noreferrer"
                                            )
                                        }
                                    >
                                        View on AlSaqr
                                    </CommonLink>
                                    <CreateEntityButton typeOfFeed={TypeOfFeeds.MyGroups} />

                                    </>
                                ) : null}
                            </div>
                        </div>
                        <div className="mt-3 ml-1 space-y-1">
                            <h1 className="text-lg font-bold leading-6 text-gray-800 dark:text-white">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm font-medium leading-5 text-gray-600 dark:text-gray-400">
                                @{currentSessionUser?.username}
                            </p>
                            <p className="pt-1 text-sm text-gray-500 dark:text-gray-300">
                                Manage the groups and events you founded.
                            </p>
                        </div>
                    </div>
                    <hr className="border-gray-800" />
                </div>

                <Tabs
                    tabs={[
                        {
                            tabKey: GROUPS_TAB,
                            title: "My Groups",
                            content: ownedGroups.length ? [ownedGroups] : [],
                            renderer: groupsRenderer,
                            noRecordsContent: "You haven't created any groups yet.",
                        },
                        {
                            tabKey: EVENTS_TAB,
                            title: "My Events",
                            content: ownedEvents.length ? [ownedEvents] : [],
                            renderer: eventsRenderer,
                            noRecordsContent: "You haven't created any events yet.",
                        },
                    ]}
                    loading={myGroupsFeedStore.loadingInitial || myEventsFeedStore.loadingInitial}
                    loadOnTabSwitch={loadOnTabSwitch}
                />
            </div>
        </div>
    );
});

export default AdminDashboard;
