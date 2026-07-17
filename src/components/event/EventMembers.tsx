import { useEffect, useState } from "react";
import { SkeletonLoader } from "@common/CustomLoader";
import { groupsApiClient } from "@utils/api/groupsApiClient";
import { eventsApiClient } from "@utils/api/eventsApiClient";
import { EventMember } from "@models/event";
import { observer } from "mobx-react-lite";
import TimeAgo from "react-timeago";
import { convertDateToDisplay } from "@utils/index";
import { TrashIcon } from "@heroicons/react/outline";
import { OptimizedPostImage } from "@common/Image";

interface EventMembersProps {
  // The roster is fetched by slug; removals are keyed by id.
  eventSlug: string;
  eventId: string;
  groupId: string;
  canManage: boolean;
  onAttendeeRemoved?: () => void;
}

export default observer(function EventMembers({
  eventSlug,
  eventId,
  canManage,
  onAttendeeRemoved,
}: EventMembersProps) {
  const [attendees, setAttendees] = useState<EventMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const fetchAttendees = async () => {
    setLoading(true);
    try {
      const { eventMembers } = await eventsApiClient.getEventMembers(eventSlug);
      setAttendees(eventMembers || []);
    } catch (error) {
      console.error("Error fetching event attendees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, [eventSlug]);

  const handleRemoveAttendee = async (userId: string) => {
    if (!window.confirm("Are you sure you want to remove this attendee?")) {
      return;
    }

    setRemoving(userId);
    try {
      await groupsApiClient.removeEventMember(eventId, userId);
      setAttendees(attendees.filter((a) => a.userId !== userId));
      onAttendeeRemoved?.();
    } catch (error) {
      console.error("Error removing attendee:", error);
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return <SkeletonLoader count={3} />;
  }

  if (attendees.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">No attendees yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Attendees ({attendees.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {attendees.map((attendee) => (
          <div
            key={attendee.userId}
            className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                
                  <OptimizedPostImage
                    src={attendee.avatar ?? ""}
                    alt={attendee.username ?? "Attendee"}
                    classNames="w-10 h-10 rounded-full object-cover"
                  />
                <div>
                  {/* <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {attendee.username ?? "Member"}
                    </p>
                    {attendee.isLocalGuide && (
                      <TagOrLabel
                        testId="localguidetag"
                        color="userGradient"
                        size="sm"
                        rounded
                      >
                        Local Guide
                      </TagOrLabel>
                    )}
                  </div> */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 bg-red-500">
                    {attendee.hobbies.join(", ")}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <TimeAgo
                date={convertDateToDisplay(attendee.joinedAt)}
              />
              {canManage && (
                <button
                  onClick={() => handleRemoveAttendee(attendee.userId)}
                  disabled={removing === attendee.userId}
                  className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                  title="Remove attendee"
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
