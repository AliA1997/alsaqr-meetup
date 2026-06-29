import { observer } from "mobx-react-lite";
import Carousel from "@components/shared/Carousel";
import { GroupRecord } from "@models/group";
import { useStore } from "@stores/index";
import GroupOwnerActions from "./GroupOwnerActions";
import CreateEventButton from "@components/event/CreateEventButton";
import ContactFounderButton from "./ContactFounderButton";



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
  // Only the group's founder may add events; everyone else gets "Contact founder".
  const isFounder = !!authStore.currentSessionUser && authStore.currentSessionUser.id === group.founderId;

  return (
    <div data-testid="groupdetailscard" className="flex flex-col">

      <section className="flex w-full flex-col py-4 md:flex-row">
        <Carousel images={group.images} entityName={group.name} />

        <div className="flex w-full flex-col items-center space-y-4 px-0 py-2 md:w-1/2 md:px-4 lg:px-12">
          <p className="p-2 text-[2rem] font-bold md:text-[2.5rem]">{group.name}</p>
          <GroupOwnerActions group={group} onUpdated={onRefresh} />
          <div className="px-2">
            {isFounder
              ? <CreateEventButton groupId={group.id} onUpdated={onRefresh} />
              : <ContactFounderButton group={group} />}
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
    </div>
  );
});