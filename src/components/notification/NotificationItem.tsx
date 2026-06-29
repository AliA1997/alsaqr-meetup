// import { useNavigate } from "react-router-dom";
import {
  useLayoutEffect,
  useRef,
} from "react";
import {  NotificationToDisplay } from "@typings";
import TimeAgo from "react-timeago";
import { useStore } from "@stores/index";
import { convertDateToDisplay } from "@utils/index";

interface Props {
  notificationToDisplay: NotificationToDisplay;
}

function NotificationItemComponent({
  notificationToDisplay,
}: Props) {
  const { authStore } = useStore();
  const { currentSessionUser } = authStore;
  // const navigate = useNavigate();

  const initiallyBooleanValues = useRef<{
    read: boolean;
  }>({
    read: false,
  });

  const notificationInfo = notificationToDisplay;

  const getNotificationTypeLabel = (): string => {
    if (notificationInfo.postId) return "Post";
    if (notificationInfo.listItemId) return "List Item";
    if (notificationInfo.relatedUserId) return "Related User";
    if (notificationInfo.listId) return "List";
    if (notificationInfo.communityDiscussionMessageId)
      return "Community Discussion Message";
    if (notificationInfo.communityDiscussionId) return "Community Discussion";
    if (notificationInfo.communityId) return "Community";
    return "Notification";
  };

  const notificationTypeLabel = getNotificationTypeLabel();

  useLayoutEffect(() => {
    if (currentSessionUser?.id) {

      initiallyBooleanValues.current = {
        read: false
      };
    }
  }, [currentSessionUser]);


  const navigateToNotification = () => {
    // if(notificationInfo.notificationType.toString().includes('post'))
    //     navigate(notificationInfo.link ?? `/status/${notificationInfo.relatedEntityId}`);
  }

  return (
    <>
      <div
        className={`
          flex flex-col relative justify-between space-x-3 border-y border-gray-100 p-5
          hover:shadow-lg dark:border-gray-800 dark:hover:bg-[#000000] rounded-full
          p-2 hover:shadow-lg dark:border-gray-800 dark:hover:bg-[#0e1517] rounded-full
          w-full
          h-[5em]
          cursor-pointer
        `}
        onClick={navigateToNotification}
        data-testid="notificationcard"
      >
        <div className="absolute m-0 inset-0"></div>
        <div className="flex flex-col justify-between h-full space-x-3 cursor-pointer">
          <div className="flex justify-between item-center space-x-1">
            <span
              className="text-xs font-semibold uppercase tracking-wide text-blue-500 dark:text-blue-400"
              data-testid="notificationtype"
            >
              {notificationTypeLabel}
            </span>
          </div>
          <div className="flex justify-between item-center space-x-1">
            <p
              className='text-sm'
              data-testid="notificationtext"
            >
              {notificationInfo.notificationMessage}
            </p>
            {notificationInfo.notificationCreatedAt && (
              <TimeAgo
                date={convertDateToDisplay(notificationInfo.notificationCreatedAt)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default NotificationItemComponent;