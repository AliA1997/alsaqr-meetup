import { useEffect, useMemo, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@stores/index";
import { PagingParams } from "@models/common";
// @ts-ignore: external URL import for runtime bundler
import { ContentContainerWithRef } from "@common/Containers";
import { SkeletonLoader } from "@common/CustomLoader";
import NotificationItemComponent from "./NotificationItem";
import { NoRecordsTitle, PageTitle } from "@common/Titles";

interface Props {}

const NotificationFeed = observer(({}: Props) => {
  const { authStore } = useStore();
  const { currentSessionUser } = authStore;
  const userId = useMemo(
    () => (currentSessionUser ? currentSessionUser.id : ""),
    [currentSessionUser],
  );

  const { notificationStore } = useStore();
  const {
    loadNotifications,
    loadingInitial,
    setPagingParams,
    pagingParams,
    pagination,
    notifications,
  } = notificationStore;

  const containerRef = useRef(null);
  const loaderRef = useRef(null);

  async function getNotifications() {
    try {
      if (userId) await loadNotifications(userId);
    } finally {
    }
  }

  const fetchMoreItems = async (pageNum: number) => {
    setPagingParams(new PagingParams(pageNum, 10));
    if (userId) await loadNotifications(userId);
  };

  useEffect(() => {
    getNotifications();
  }, []);

  // 1. Add this loader component at the end of your posts list
  const LoadMoreTrigger = () => {
    return (
      <div ref={loaderRef} style={{ height: "20px" }}>
        {loadingInitial && <div>Loading more notifications...</div>}
      </div>
    );
  };

  // 2. Fix your Intersection Observer useEffect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        const currentPage = pagination?.currentPage ?? 1;
        const itemsPerPage = pagination?.itemsPerPage ?? 10;
        const totalItems = pagination?.totalItems ?? 0;

        const nextPage = currentPage + 1;
        const totalItemsOnNextPage = nextPage * itemsPerPage;
        const hasMoreItems = totalItems > totalItemsOnNextPage;
        if (
          firstEntry?.isIntersecting &&
          !loadingInitial &&
          hasMoreItems &&
          notifications.length > 0
        ) {
          fetchMoreItems(pagingParams.currentPage + 1);
        }
      },
      {
        root: containerRef.current,
        rootMargin: "100px",
        threshold: 0.2,
      },
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
          <SkeletonLoader count={4} />
        ) : (
          <>
            {notifications && notifications.length ? (
              notifications.map((notificationRecord, notificationKey) => (
                <NotificationItemComponent
                  key={notificationRecord.notificationId ?? notificationKey}
                  notificationToDisplay={notificationRecord}
                />
              ))
            ) : (
              <NoRecordsTitle>No Notifications to show</NoRecordsTitle>
            )}
            <LoadMoreTrigger />
          </>
        )}
      </ContentContainerWithRef>
    </div>
  );
});

export default NotificationFeed;
