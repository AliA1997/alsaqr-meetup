
import { useEffect, useMemo, useRef, useState } from "react";
import { convertQueryStringToObject } from "@utils/index";
import { observer } from "mobx-react-lite";
import { useStore } from "@stores/index";
import { PagingParams } from "@models/common";
import { leadingDebounce } from "@utils/common";
import { ContentContainerWithRef } from "@common/Containers";
import { NoRecordsTitle } from "@common/Titles";

import CustomPageLoader from "@common/CustomLoader";
import { LocalGuideRecord } from "@models/localGuide";
import LocalGuideCard from "./LocalGuideCard";


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
        predicate,
        setPredicate,
        nearbyLocalGuides
    } = localGuidesFeedStore;
    const [loading, setLoading] = useState<boolean>(false);
    const containerRef = useRef(null);
    const loaderRef = useRef(null);


    const loadRecords = async () => {
        await loadLocalGuides();
    }

    async function getLocalGuides() {
        leadingDebounce(async () => {

            setLoading(true);
            try {
                const paramsFromQryString = convertQueryStringToObject(
                    window.location.search
                );

                if (
                    (paramsFromQryString.currentPage && paramsFromQryString.itemsPerPage)
                    && (paramsFromQryString.currentPage !== predicate.get('currentPage')
                        || paramsFromQryString.itemsPerPage !== predicate.get('itemsPerPage')
                        || paramsFromQryString.searchTerm != predicate.get('searchTerm'))) {

                    setPagingParams(new PagingParams(paramsFromQryString.currentPage, paramsFromQryString.itemsPerPage));
                    setPredicate('searchTerm', paramsFromQryString.searchTerm);
                }

                await loadRecords();
            } finally {
                setLoading(false);
            }
        }, 10000);
    }

    const fetchMoreItems = async (pageNum: number) => {
        setPagingParams(new PagingParams(pageNum, 10))
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


    const LoadMoreTrigger = () => {
        return (
            <div ref={loaderRef} style={{ height: '20px' }}>
                {loadingInitial && loadedRecords.length > 0 && <div>Loading more records...</div>}
            </div>
        );
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const firstEntry = entries[0];
                const currentPage = pagination?.currentPage ?? 1;
                const itemsPerPage = pagination?.itemsPerPage ?? 10;
                const totalItems = pagination?.totalItems ?? 0;

                const nextPage = currentPage + 1;
                const totalItemsOnNextPage = nextPage * itemsPerPage;
                const hasMoreItems = (totalItems >= totalItemsOnNextPage);
                if (firstEntry?.isIntersecting && !loadingInitial && hasMoreItems) {
                    fetchMoreItems(pagingParams.currentPage + 1);
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
                    ? loadedRecords.map((localGuideRec: LocalGuideRecord) => <LocalGuideCard key={localGuideRec.id} localGuide={localGuideRec} />)
                    : <NoRecordsTitle>
                        No Local Guides to Show
                    </NoRecordsTitle>}
                <LoadMoreTrigger />
            </div>
        </ContentContainerWithRef>
    );
});


export default LocalGuidesFeed;
