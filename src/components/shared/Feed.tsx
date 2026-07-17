
import { useEffect, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@stores/index";
import { PagingParams } from "@models/common";
import { leadingDebounce } from "@utils/api/common";
import { ContentContainerWithRef } from "@common/Containers";
import { NoRecordsTitle } from "@common/Titles";

import { TypeOfFeeds } from "@models/enums";
import GroupCard from "@components/group/GroupCard";
import { GroupRecord } from "@models/group";
import { EventRecord } from "@models/event";
import EventCard from "@components/event/EventCard";
import LocalGuideCard from "@components/users/LocalGuideCard";
import { SkeletonLoader } from "@common/CustomLoader";


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

    const loadRecords = async () => {
        if (typeOfFeed === TypeOfFeeds.NearbyEvents) await eventsFeedStore.loadEvents();
        else if (typeOfFeed === TypeOfFeeds.NearbyOnlineEvents) return onlineEventsFeedStore.loadOnlineEvents();
        else if (typeOfFeed === TypeOfFeeds.MyEvents) return myEventsFeedStore.loadMyEvents();
        else if (typeOfFeed === TypeOfFeeds.MyGroups) return myGroupsFeedStore.loadMyGroups();
        else await groupsFeedStore.loadGroups();
    }

    // Memoized so the debouncer — and therefore its cooldown timer — survives re-renders;
    // a fresh one each render would have nothing to debounce against.
    const getGroupsOrEvents = useMemo(
        () => leadingDebounce(async () => {
            setLoading(true);
            try {
                await loadRecords();
            } finally {
                setLoading(false);
            }
        }, 10000),
        []
    );

    const fetchMoreItems = async (pageNum: number) => {
        setFeedPagingParams(new PagingParams(pageNum, feedPagingParams.itemsPerPage))
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


    // The observer is created once per mount, so its callback would capture the pagination
    // state from that render forever. Route it through a ref that every render refreshes.
    const onIntersect = useRef<() => void>(() => { });
    onIntersect.current = () => {
        if (feedLoadingInitial) return;

        const currentPage = feedPagination?.currentPage ?? 0;
        const totalPages = feedPagination?.totalPages ?? 0;
        if (currentPage >= totalPages) return;

        fetchMoreItems(currentPage + 1);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) onIntersect.current();
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
        // The skeleton swap replaces the trigger node, so re-observe the new one.
    }, [loading]);


    const noRecordsText = useMemo(() => {
        if(typeOfFeed === TypeOfFeeds.NearbyEvents)
            return "No Nearby Events Found";
        else if(typeOfFeed === TypeOfFeeds.NearbyOnlineEvents)
            return "No Nearby Online Events Found";
        else if(typeOfFeed === TypeOfFeeds.NearbyGroups)
            return "No Nearby Groups Found";
        else if(typeOfFeed === TypeOfFeeds.MyEvents)
            return "No Events Found";
        else if(typeOfFeed === TypeOfFeeds.MyGroups)
            return "No Groups Found";
        else if(typeOfFeed === TypeOfFeeds.LocalGuides)
            return "No Nearby Local Guides";
        else
            return "No Records Found";
    }, [typeOfFeed]);

    const renderCard = (rec: any) => {
        if(typeOfFeed === TypeOfFeeds.MyGroups || typeOfFeed === TypeOfFeeds.NearbyGroups)
             return <GroupCard
                        key={rec.id}
                        testId="localGuideCard"
                        group={rec}
                    />       
        else if(typeOfFeed === TypeOfFeeds.MyEvents || typeOfFeed === TypeOfFeeds.NearbyEvents || typeOfFeed === TypeOfFeeds.NearbyOnlineEvents)
            return <EventCard
                        key={rec.id}
                        testId="localGuideCard"
                        event={rec}
                    />
        else if(typeOfFeed === TypeOfFeeds.LocalGuides)
            return <LocalGuideCard
                        key={rec.id}
                        testId="localGuideCard"
                        localGuide={rec}
                    />
        else
            return <div />
    }

    

    if (loading)
        return <SkeletonLoader count={6} />;

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
                    ? loadedRecords.map((groupOrEventRec: EventRecord | GroupRecord) => renderCard(groupOrEventRec))
                    : <NoRecordsTitle>
                        {noRecordsText}
                    </NoRecordsTitle>}
                <div ref={loaderRef} style={{ height: '20px' }}>
                    {feedLoadingInitial && loadedRecords.length > 0 && <div>Loading more records...</div>}
                </div>
            </div>
        </ContentContainerWithRef>
    );
});


export default Feed;
