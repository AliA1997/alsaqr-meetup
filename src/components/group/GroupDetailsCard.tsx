import Carousel from "@components/shared/Carousel";
import { GroupRecord } from "@models/group";



export default function GroupDetailsCard({
  group
}: {
  group: GroupRecord
}) {
  
  return (
    <div data-testid="groupdetailscard" className="flex flex-col">

      <section className="flex w-full flex-col py-4 md:flex-row">
        <Carousel images={group.images} entityName={group.name} />

        <div className="flex w-full flex-col space-y-4 px-0 py-2 md:w-1/2 md:px-4 lg:px-12">
          <p className="p-2 text-[2rem] font-bold md:text-[2.5rem]">{group.name}</p>

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
}