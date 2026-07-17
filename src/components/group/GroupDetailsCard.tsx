import { observer } from "mobx-react-lite";
import Carousel from "@components/shared/Carousel";
import { GroupRecord } from "@models/group";
import { useStore } from "@stores/index";
import GroupOwnerActions from "./GroupOwnerActions";
import CreateEventButton from "@components/event/CreateEventButton";
import ContactFounderButton from "./ContactFounderButton";
import JoinGroupButton from "./JoinGroupButton";
import GroupMembers from "./GroupMembers";
import { useState } from "react";



interface GroupDetailsCardProps {
  group: GroupRecord;
  // Refetches the group on this page after the founder edits it.
  onRefresh?: () => void;
}

export default observer(function GroupDetailsCard({
  group,
  onRefresh
}: GroupDetailsCardProps) {
  const { authStore } = useStore();
  const [refreshMembers, setRefreshMembers] = useState(false);
  // Only the group's founder may add events; everyone else gets "Contact founder".
  const isFounder = !!authStore.currentSessionUser && authStore.currentSessionUser.id === group.founderId;
  const isLoggedIn = !!authStore.currentSessionUser;
  const isJoined = group.userMembershipStatus === 'joined';

  const handleJoinSuccess = () => {
    onRefresh?.();
  };

  return (
    <div data-testid="groupdetailscard" className="flex flex-col">

      <section className="flex w-full flex-col py-4 md:flex-row">
        <Carousel images={group.images} entityName={group.name} />

        <div className="flex w-full flex-col items-center space-y-4 px-0 py-2 md:w-1/2 md:px-4 lg:px-12">
          <p className="p-2 text-[2rem] font-bold md:text-[2.5rem]">{group.name}</p>
          {isJoined && (
            <div className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm font-medium">
              ✓ You are a member of this group
            </div>
          )}
          <GroupOwnerActions group={group} onUpdated={onRefresh} />
          <div className="px-2 flex flex-col gap-2 w-full items-center">
            {isFounder
              ? <CreateEventButton groupId={group.id} onUpdated={onRefresh} />
              : <ContactFounderButton group={group} />}
            {isLoggedIn && !isFounder && (
              <JoinGroupButton 
                groupId={group.id} 
                isJoined={isJoined} 
                onJoinSuccess={handleJoinSuccess} 
              />
            )}
          </div>

        </div>
      </section>
      <section>
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <tbody>
                {group.description && (
                  <tr className="border-b border-gray-200">
                    <td className="px-2 py-2 font-medium text-gray-600">
                      Description:
                    </td>
                    <td className="px-2 py-2">{group.description}</td>
                  </tr>
                )}
                
                <tr className="border-b border-gray-200">
                  <td className="whitespace-nowrap px-2 py-2 font-medium text-gray-600">
                    Located In:
                  </td>
                  <td className="px-2 py-2">{group.city}, {group.country}</td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="whitespace-nowrap px-2 py-2 font-medium text-gray-600">
                    Number of Attendees:
                  </td>
                  <td className="px-2 py-2">{group.attendees.length}</td>
                </tr>


                <tr>
                  <td className="px-2 py-2 font-medium text-gray-600">
                    Distance in Km from you:
                  </td>
                  <td className="px-2 py-2">{group.distanceKm}</td>
                </tr>
              </tbody>
            </table>
          </div>
      </section>
      {isFounder && (
        <section className="mt-6 px-4">
          <GroupMembers
            groupSlug={group.slug}
            groupId={group.id}
            canManage={isFounder}
            onMemberRemoved={() => {
              onRefresh?.();
              setRefreshMembers(!refreshMembers);
            }}
          />
        </section>
      )}
    </div>
  );
});