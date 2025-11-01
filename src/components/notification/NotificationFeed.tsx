import { useEffect, useMemo, useRef } from "react";
import { convertQueryStringToObject } from "@utils/index";
import { observer } from "mobx-react-lite";
import { useStore } from "@stores/index";
import { PagingParams } from "@models/common";
import { NoRecordsTitle, PageTitle } from "@common/Titles";
import { ContentContainerWithRef } from "@common/Containers";
import CustomPageLoader from "@common/CustomLoader";
import NotificationItemComponent from "./NotificationItem";
import { leadingDebounce } from "@utils/common";

interface Props { }

const NotificationFeed = observer(({ }: Props) => {

  const { authStore } = useStore();
  const { currentSessionUser } = authStore;
  const userId = useMemo(() => currentSessionUser ? currentSessionUser.id : "", [currentSessionUser]);

  const { notificationStore } = useStore();
  const {
    loadNotifications,
    loadingInitial,
    setPagingParams,
    pagingParams,
    setPredicate,
    predicate,
    pagination,
    notifications
  } = notificationStore;

  const containerRef = useRef(null);
  const loaderRef = useRef(null);


  async function getNotifications() {
    leadingDebounce(async () => {

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

        if (userId)
          await loadNotifications(userId);
      } finally {
      }
    }, 10000);
  }

  const fetchMoreItems = async (pageNum: number) => {
    setPagingParams(new PagingParams(pageNum, 10))
    if (userId)
      await loadNotifications(userId);
  };


  useEffect(() => {
    getNotifications();
  }, []);


  // 1. Add this loader component at the end of your posts list
  const LoadMoreTrigger = () => {
    return (
      <div ref={loaderRef} style={{ height: '20px' }}>
        {loadingInitial && <div>Loading more notifications...</div>}
      </div>
    );
  };

  // 2. Fix your Intersection Observer useEffect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        const currentPage = pagination?.currentPage ?? 0;
        const itemsPerPage = pagination?.itemsPerPage ?? 10;
        const totalItems = pagination?.totalItems ?? 0;

        const nextPage = currentPage + 1;
        const totalItemsOnNextPage = nextPage * itemsPerPage;
        const hasMoreItems = (totalItems > totalItemsOnNextPage);
        if (firstEntry?.isIntersecting && !loadingInitial && hasMoreItems && notifications.length > 0) {
          fetchMoreItems(pagingParams.currentPage + 1);
        }
      },
      {
        root: containerRef.current,
        rootMargin: '100px',
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


  return (
    <div className="col-span-7 text-left scrollbar-hide border-x max-h-screen overflow-scroll lg:col-span-5 dark:border-gray-800">
      <PageTitle>Your Notifications</PageTitle>

      <ContentContainerWithRef
        classNames={`
          text-center overflow-y-auto scrollbar-hide min-h-[100vh] max-h-[100vh]
        `}
        ref={containerRef}
      >
        {loadingInitial ? (
          <CustomPageLoader title="Loading" />
        ) : (
          <>
            {notifications && notifications.length
              ? notifications.map((notificationRecord, notificationKey) => (
                <NotificationItemComponent
                  key={notificationRecord.notification.id ?? notificationKey}
                  notificationToDisplay={notificationRecord}
                />
              ))
              : <NoRecordsTitle>No Notifications to show</NoRecordsTitle>}
            <LoadMoreTrigger />
          </>
        )}
      </ContentContainerWithRef>
    </div>
  );
});


export default NotificationFeed;
