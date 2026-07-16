import { useStore } from "@stores/index";
import { InfoButton } from "@common/Buttons";
import { ButtonLoader } from "@common/CustomLoader";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/outline";
import { observer } from "mobx-react-lite";

interface JoinEventButtonProps {
  eventId: string;
  isAttending: boolean;
  onAttendanceChange: () => void;
  disabled?: boolean;
}

export default observer(function JoinEventButton({
  eventId,
  isAttending,
  onAttendanceChange,
  disabled = false,
}: JoinEventButtonProps) {
  const { eventsFeedStore, authStore } = useStore();
  const { currentSessionUser } = authStore;
  const { loadingJoinLeave } = eventsFeedStore;

  const handleAttendanceToggle = async () => {
    try {
      if (isAttending) {
        await eventsFeedStore.leaveEvent(eventId, currentSessionUser?.id ?? "");
      } else {
        await eventsFeedStore.joinEvent(eventId);
      }
      onAttendanceChange();
    } catch (error) {
      console.error("Error updating event attendance:", error);
    }
  };

  return (
    <InfoButton
      disabled={disabled || loadingJoinLeave}
      onClick={handleAttendanceToggle}
      classNames="px-3 py-2 cursor-pointer"
    >
      {loadingJoinLeave ? (
        <ButtonLoader />
      ) : (
        <div className={`
          flex items-center gap-2
          ${isAttending ? 'hover:text-red-400' : 'hover:text-[#55a8c2]'}
          transition-colors duration-200
        `}>
          <span className="font-medium">
            {isAttending ? 'Cancel Attendance' : 'Attend Event'}
          </span>
          {!isAttending && <PlusCircleIcon className="h-5 w-5" />}
          {isAttending && <TrashIcon className="h-5 w-5" />}
        </div>
      )}
    </InfoButton>
  );
});
