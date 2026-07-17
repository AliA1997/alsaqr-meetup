import { useStore } from "@stores/index";
import { InfoButton } from "@common/Buttons";
import { ButtonLoader } from "@common/CustomLoader";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/outline";
import { observer } from "mobx-react-lite";

interface JoinGroupButtonProps {
  groupId: string;
  isJoined: boolean;
  onJoinSuccess: () => void;
  disabled?: boolean;
}

export default observer(function JoinGroupButton({
  groupId,
  isJoined,
  onJoinSuccess,
  disabled = false,
}: JoinGroupButtonProps) {
  const { groupsFeedStore } = useStore();
  const { loadingJoinLeave } = groupsFeedStore;

  const handleJoinLeave = async () => {
    try {
      if (isJoined) {
        await groupsFeedStore.leaveGroup(groupId);
      } else {
        await groupsFeedStore.joinGroup(groupId);
      }
      onJoinSuccess();
    } catch (error) {
      console.error("Error updating group membership:", error);
    }
  };

  return (
    <InfoButton
      disabled={disabled || loadingJoinLeave}
      onClick={handleJoinLeave}
      classNames="px-3 py-2 cursor-pointer"
    >
      {loadingJoinLeave ? (
        <ButtonLoader />
      ) : (
        <div className={`
          flex items-center gap-2
          ${isJoined ? 'hover:text-red-400' : 'hover:text-[#55a8c2]'}
          transition-colors duration-200
        `}>
          <span className="font-medium">
            {isJoined ? 'Leave Group' : 'Join Group'}
          </span>
          {!isJoined && <PlusCircleIcon className="h-5 w-5" />}
          {isJoined && <TrashIcon className="h-5 w-5" />}
        </div>
      )}
    </InfoButton>
  );
});
