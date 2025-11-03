import Carousel from "@components/shared/Carousel";
import { EventRecord } from "@models/event";


export default function EventDetailsCard({
  event
}: {
  event: EventRecord
}) {
  return (
    <div data-testid="eventdetailscard" className="flex flex-col">

      <section className="flex w-full flex-col py-4 md:flex-row">
        <Carousel images={event.images} entityName={event.name} />

        <div className="flex w-full flex-col space-y-4 px-0 py-2 md:w-1/2 md:px-4 lg:px-12">
          <p className="p-2 text-[2rem] font-bold md:text-[2.5rem]">{event.name}</p>

        </div>
      </section>
      <section>
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="whitespace-nowrap px-2 py-2 font-medium text-gray-600">
                    Group:
                  </td>
                  <td className="px-2 py-2">{event.groupName}</td>
                </tr>

                {event.description && (
                  <tr className="border-b border-gray-200">
                    <td className="px-2 py-2 font-medium text-gray-600">
                      Description:
                    </td>
                    <td className="px-2 py-2">{event.description}</td>
                  </tr>
                )}

                <tr>
                  <td className="px-2 py-2 font-medium text-gray-600">
                    Distance in Km from you:
                  </td>
                  <td className="px-2 py-2">{event.distanceKm}</td>
                </tr>
              </tbody>
            </table>
          </div>
      </section>
    </div>
  );
}