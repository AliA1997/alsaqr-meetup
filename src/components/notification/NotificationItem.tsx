
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const initiallyBooleanValues = useRef<{
    read: boolean;
  }>({
    read: false,
  });

  const notificationInfo = notificationToDisplay.notification;

  useLayoutEffect(() => {
    if (currentSessionUser?.id) {

      initiallyBooleanValues.current = {
        read: false
      };
    }
  }, [currentSessionUser]);


  const navigateToNotification = () => {
    if(notificationInfo.notificationType.toString().includes('post'))
        navigate(notificationInfo.link ?? `/status/${notificationInfo.relatedEntityId}`);
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
      >
        <div className="absolute m-0 inset-0"></div>
        <div className="flex flex-col justify-between h-full space-x-3 cursor-pointer">
        {notificationInfo.image && (
            <img
                className="h-10 w-10 rounded-full object-cover "
                src={notificationInfo.image}
                alt={notificationInfo.message}
            />
        )}
          <div className="flex justify-between item-center space-x-1">
            <p className='text-sm'>
              {notificationInfo.message}
            </p>
            {notificationInfo.createdAt && (
              <TimeAgo
                date={convertDateToDisplay(notificationInfo.createdAt)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default NotificationItemComponent;
