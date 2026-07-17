
import { useEffect, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@stores/index";
import { PagingParams } from "@models/common";
import { leadingDebounce } from "@utils/api/common";
import { ContentContainerWithRef } from "@common/Containers";
import { NoRecordsTitle } from "@common/Titles";

import { LocalGuideRecord } from "@models/localGuide";
import LocalGuideCard from "./LocalGuideCard";
import { SkeletonLoader } from "@common/CustomLoader";


const LocalGuidesFeed = observer(() => {
    const {
        localGuidesFeedStore
    } = useStore();
    const {
        loadingInitial,
        pagination,
        setPagingParams,
        pagingParams,
        loadLocalGuides,
        nearbyLocalGuides
    } = localGuidesFeedStore;
    const [loading, setLoading] = useState<boolean>(false);
    const containerRef = useRef(null);
    const loaderRef = useRef(null);


    const loadRecords = async () => {
        await loadLocalGuides();
    }

    // Memoized so the debouncer — and therefore its cooldown timer — survives re-renders;
    // a fresh one each render would have nothing to debounce against.
    const getLocalGuides = useMemo(
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
        setPagingParams(new PagingParams(pageNum, pagingParams.itemsPerPage))
        await loadRecords();
    };


    useEffect(() => {
        getLocalGuides();
    }, []);

    const loadedRecords = useMemo(() => {
        return nearbyLocalGuides;
    }, [
        nearbyLocalGuides,
    ]);


    // The observer is created once per mount, so its callback would capture the pagination
    // state from that render forever. Route it through a ref that every render refreshes.
    const onIntersect = useRef<() => void>(() => { });
    onIntersect.current = () => {
        if (loadingInitial) return;

        const currentPage = pagination?.currentPage ?? 0;
        const totalPages = pagination?.totalPages ?? 0;
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
                    ? loadedRecords.map((localGuideRec: LocalGuideRecord) => <LocalGuideCard key={localGuideRec.id} localGuide={localGuideRec} />)
                    : <NoRecordsTitle>
                        No Local Guides to Show
                    </NoRecordsTitle>}
                <div ref={loaderRef} style={{ height: '20px' }}>
                    {loadingInitial && loadedRecords.length > 0 && <div>Loading more records...</div>}
                </div>
            </div>
        </ContentContainerWithRef>
    );
});


export default LocalGuidesFeed;
