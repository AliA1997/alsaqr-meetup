import { useEffect, useState } from "react";
import { SkeletonLoader } from "@common/CustomLoader";
import { groupsApiClient } from "@utils/api/groupsApiClient";
import { GroupMember } from "@models/group";
import { observer } from "mobx-react-lite";
import TimeAgo from "react-timeago";
import { convertDateToDisplay } from "@utils/index";
import { TrashIcon } from "@heroicons/react/outline";

interface GroupMembersProps {
  // The roster is fetched by slug; removals are keyed by id.
  groupSlug: string;
  groupId: string;
  canManage: boolean;
  onMemberRemoved?: () => void;
}

export default observer(function GroupMembers({
  groupSlug,
  groupId,
  canManage,
  onMemberRemoved,
}: GroupMembersProps) {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { groupMembers } = await groupsApiClient.getGroupMembers(groupSlug);
      setMembers(groupMembers || []);
    } catch (error) {
      console.error("Error fetching group members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [groupSlug]);

  const handleRemoveMember = async (userId: string) => {
    if (!window.confirm("Are you sure you want to remove this member?")) {
      return;
    }

    setRemoving(userId);
    try {
      await groupsApiClient.removeGroupMember(groupId, userId);
      setMembers(members.filter((m) => m.userId !== userId));
      onMemberRemoved?.();
    } catch (error) {
      console.error("Error removing member:", error);
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return <SkeletonLoader count={3} />;
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">No members yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Group Members ({members.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {members.map((member) => (
          <div
            key={member.userId}
            className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.username ?? "Group member"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#55a8c2] to-[#2c5f7c] flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {member.username?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {member.username ?? "Former member"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {member.hobbies.join(", ")}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <TimeAgo
                date={convertDateToDisplay(member.joinedAt)}
              />
              {canManage && (
                <button
                  onClick={() => handleRemoveMember(member.userId)}
                  disabled={removing === member.userId}
                  className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                  title="Remove member"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
