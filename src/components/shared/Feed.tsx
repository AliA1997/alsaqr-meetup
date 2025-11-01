
import { useEffect, useMemo, useRef, useState } from "react";
import { convertQueryStringToObject } from "@utils/index";
import { observer } from "mobx-react-lite";
import { useStore } from "@stores/index";
import { PagingParams } from "@models/common";
import { leadingDebounce } from "@utils/common";
import { ContentContainerWithRef } from "@common/Containers";
import { NoRecordsTitle } from "@common/Titles";

import CustomPageLoader from "@common/CustomLoader";
import { TypeOfFeeds } from "@models/enums";
import GroupCard from "@components/group/GroupCard";
import { GroupRecord } from "@models/group";
import { EventRecord } from "@models/event";
import EventCard from "@components/event/EventCard";

interface Props {
    typeOfFeed?: TypeOfFeeds;
}


const Feed = observer(({
    typeOfFeed
}: Props) => {
    const {
        groupsFeedStore,
        myGroupsFeedStore,
        eventsFeedStore,
        onlineEventsFeedStore,
        myEventsFeedStore,
    } = useStore();
    const [loading, setLoading] = useState<boolean>(false);
    const containerRef = useRef(null);
    const loaderRef = useRef(null);

    const feedLoadingInitial = useMemo(() => {
        if (typeOfFeed === TypeOfFeeds.NearbyEvents) return eventsFeedStore.loadingInitial;
        else if (typeOfFeed === TypeOfFeeds.NearbyOnlineEvents) return onlineEventsFeedStore.loadingInitial;
        else if (typeOfFeed === TypeOfFeeds.MyEvents) return myEventsFeedStore.loadingInitial;
        else if (typeOfFeed === TypeOfFeeds.MyGroups) return myGroupsFeedStore.loadingInitial;
        else return groupsFeedStore.loadingInitial;
    }, [
        eventsFeedStore.loadingInitial,
        groupsFeedStore.loadingInitial,
        onlineEventsFeedStore.loadingInitial,
        myEventsFeedStore.loadingInitial,
        myGroupsFeedStore.loadingInitial
    ]);

    const setFeedPagingParams = useMemo(() => {
        if (typeOfFeed === TypeOfFeeds.NearbyEvents) return eventsFeedStore.setPagingParams;
        else if (typeOfFeed === TypeOfFeeds.NearbyOnlineEvents) return onlineEventsFeedStore.setPagingParams;
        else if (typeOfFeed === TypeOfFeeds.MyEvents) return myEventsFeedStore.setPagingParams;
        else if (typeOfFeed === TypeOfFeeds.MyGroups) return myGroupsFeedStore.setPagingParams;
        else return groupsFeedStore.setPagingParams;
    }, [
        eventsFeedStore.pagingParams.currentPage,
        groupsFeedStore.pagingParams.currentPage,
        onlineEventsFeedStore.pagingParams.currentPage,
        myEventsFeedStore.pagingParams.currentPage,
        myGroupsFeedStore.pagingParams.currentPage
    ]);

    const setFeedPredicate = useMemo(() => {
        if (typeOfFeed === TypeOfFeeds.NearbyEvents) return eventsFeedStore.setPredicate;
        else if (typeOfFeed === TypeOfFeeds.NearbyOnlineEvents) return onlineEventsFeedStore.setPredicate;
        else if (typeOfFeed === TypeOfFeeds.MyEvents) return myEventsFeedStore.setPredicate;
        else if (typeOfFeed === TypeOfFeeds.MyGroups) return myGroupsFeedStore.setPredicate;
        else return groupsFeedStore.setPredicate;
    }, []);

    const feedPagingParams = useMemo(() => {
        if (typeOfFeed === TypeOfFeeds.NearbyEvents) return eventsFeedStore.pagingParams;
        else if (typeOfFeed === TypeOfFeeds.NearbyOnlineEvents) return onlineEventsFeedStore.pagingParams;
        else if (typeOfFeed === TypeOfFeeds.MyEvents) return myEventsFeedStore.pagingParams;
        else if (typeOfFeed === TypeOfFeeds.MyGroups) return myGroupsFeedStore.pagingParams;
        else return groupsFeedStore.pagingParams;
    }, [
        eventsFeedStore.pagingParams.currentPage,
        groupsFeedStore.pagingParams.currentPage,
        onlineEventsFeedStore.pagingParams.currentPage,
        myEventsFeedStore.pagingParams.currentPage,
        myGroupsFeedStore.pagingParams.currentPage
    ]);
    const feedPagination = useMemo(() => {
        if (typeOfFeed === TypeOfFeeds.NearbyEvents) return eventsFeedStore.pagination;
        else if (typeOfFeed === TypeOfFeeds.NearbyOnlineEvents) return onlineEventsFeedStore.pagination;
        else if (typeOfFeed === TypeOfFeeds.MyEvents) return myEventsFeedStore.pagination;
        else if (typeOfFeed === TypeOfFeeds.MyGroups) return myGroupsFeedStore.pagination;
        else return groupsFeedStore.pagination;
    }, [
        eventsFeedStore.nearbyEvents,
        eventsFeedStore.pagingParams.currentPage,
        groupsFeedStore.nearbyGroups,
        groupsFeedStore.pagingParams.currentPage,
        onlineEventsFeedStore.onlineEvents,
        onlineEventsFeedStore.pagingParams.currentPage,
        myEventsFeedStore.myEvents,
        myEventsFeedStore.pagingParams.currentPage,
        myGroupsFeedStore.myGroups,
        myGroupsFeedStore.pagingParams.currentPage,
    ]);

    const filterPredicate: Map<string, any> = useMemo(() => {
        if (typeOfFeed === TypeOfFeeds.NearbyEvents) return eventsFeedStore.predicate;
        else if (typeOfFeed === TypeOfFeeds.NearbyOnlineEvents) return onlineEventsFeedStore.predicate;
        else if (typeOfFeed === TypeOfFeeds.MyEvents) return myEventsFeedStore.predicate;
        else if (typeOfFeed === TypeOfFeeds.MyGroups) return myGroupsFeedStore.predicate;
        else return groupsFeedStore.predicate;
    }, []);

    const loadRecords = async () => {
        if (typeOfFeed === TypeOfFeeds.NearbyEvents) await eventsFeedStore.loadEvents();
        else if (typeOfFeed === TypeOfFeeds.NearbyOnlineEvents) return onlineEventsFeedStore.loadOnlineEvents();
        else if (typeOfFeed === TypeOfFeeds.MyEvents) return myEventsFeedStore.loadMyEvents();
        else if (typeOfFeed === TypeOfFeeds.MyGroups) return myGroupsFeedStore.loadMyGroups();
        else await groupsFeedStore.loadGroups();
    }

    async function getGroupsOrEvents() {
        leadingDebounce(async () => {

            setLoading(true);
            try {
                const paramsFromQryString = convertQueryStringToObject(
                    window.location.search
                );

                if (
                    (paramsFromQryString.currentPage && paramsFromQryString.itemsPerPage)
                    && (paramsFromQryString.currentPage !== filterPredicate.get('currentPage')
                        || paramsFromQryString.itemsPerPage !== filterPredicate.get('itemsPerPage')
                        || paramsFromQryString.searchTerm != filterPredicate.get('searchTerm'))) {

                    setFeedPagingParams(new PagingParams(paramsFromQryString.currentPage, paramsFromQryString.itemsPerPage));
                    setFeedPredicate('searchTerm', paramsFromQryString.searchTerm);
                }

                await loadRecords();
            } finally {
                setLoading(false);
            }
        }, 10000);
    }

    const fetchMoreItems = async (pageNum: number) => {
        setFeedPagingParams(new PagingParams(pageNum, 10))
        await loadRecords();
    };


    useEffect(() => {

        getGroupsOrEvents();
    }, []);

    const loadedRecords = useMemo(() => {
        if (typeOfFeed === TypeOfFeeds.NearbyEvents) return eventsFeedStore.nearbyEvents;
        else if (typeOfFeed === TypeOfFeeds.NearbyOnlineEvents) return onlineEventsFeedStore.onlineEvents;
        else if (typeOfFeed === TypeOfFeeds.MyEvents) return myEventsFeedStore.myEvents;
        else if (typeOfFeed === TypeOfFeeds.MyGroups) return myGroupsFeedStore.myGroups;
        else return groupsFeedStore.nearbyGroups;
    }, [
        eventsFeedStore.nearbyEvents,
        groupsFeedStore.nearbyGroups,
        onlineEventsFeedStore.onlineEvents,
        myEventsFeedStore.myEvents,
        myGroupsFeedStore.myGroups,
    ]);


    const LoadMoreTrigger = () => {
        return (
            <div ref={loaderRef} style={{ height: '20px' }}>
                {feedLoadingInitial && loadedRecords.length > 0 && <div>Loading more records...</div>}
            </div>
        );
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const firstEntry = entries[0];
                const currentPage = feedPagination?.currentPage ?? 1;
                const itemsPerPage = feedPagination?.itemsPerPage ?? 10;
                const totalItems = feedPagination?.totalItems ?? 0;

                const nextPage = currentPage + 1;
                const totalItemsOnNextPage = nextPage * itemsPerPage;
                const hasMoreItems = (totalItems >= totalItemsOnNextPage);
                if (firstEntry?.isIntersecting && !feedLoadingInitial && hasMoreItems) {
                    fetchMoreItems(feedPagingParams.currentPage + 1);
                }
            },
            {
                root: containerRef.current,
                rootMargin: '10px',
                threshold: 0.2
            }
        );

        const currentLoader = loaderRef.current;
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, []);

    const eventFeeds = useMemo(() => [TypeOfFeeds.NearbyEvents, TypeOfFeeds.NearbyOnlineEvents, TypeOfFeeds.MyEvents], []);

    if (loading)
        return <CustomPageLoader title="Loading" />;

    return (
        <ContentContainerWithRef
            classNames={`
                text-left scrollbar-hide
            `}
            innerRef={containerRef}
        >
            <div className={`
                scrollbar-hide max-h-screen overflow-scroll 
                dark:border-gray-800 grid w-full max-w-7xl grid-cols-2 
                gap-4 sm:grid-cols-3 md:grid-cols-4
            `}>
                {loadedRecords && loadedRecords.length
                    ? loadedRecords.map((groupOrEventRec: EventRecord | GroupRecord) => (
                        eventFeeds.some(fd => fd === typeOfFeed)
                            ? <EventCard event={groupOrEventRec as EventRecord} key={groupOrEventRec.id} />
                            : <GroupCard group={groupOrEventRec as GroupRecord} key={groupOrEventRec.id} />
                    ))
                    : <NoRecordsTitle>
                        {
                            eventFeeds.some(fd => fd === typeOfFeed) ? "No Events to show" : "No Groups to show"
                        }
                    </NoRecordsTitle>}
                <LoadMoreTrigger />
            </div>
        </ContentContainerWithRef>
    );
});


export default Feed;
