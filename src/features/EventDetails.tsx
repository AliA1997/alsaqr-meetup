import CustomPageLoader from "@common/CustomLoader";
import EventDetailsCard from "@components/event/EventDetailsCard";
import Marquee from "@components/shared/Marquee";
import { TypeOfMarquee } from "@models/enums";
import type { EventRecord } from "@models/event";
import { useStore } from "@stores/index";
import { eventsApiClient } from "@utils/eventsApiClient";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router";


export default observer(() => {
    const { commonStore, eventsFeedStore } = useStore();
    const { userIpInfo } = commonStore;
    const { eventToViewId } = eventsFeedStore;

    const [loadedEventDetails, setLoadedEventDetails] = useState<EventRecord | undefined>(undefined);
    const [loadedSimilarEvents, setLoadedSimilarEvents] = useState<EventRecord[] | undefined>(undefined);

    const { slug } = useParams();

    const getUrlParams = (latitude?: number, longitude?: number) => {
        let urlParamsToReturn = new URLSearchParams();
        const lat = latitude ? latitude : userIpInfo?.latitude;
        const long = longitude ? longitude : userIpInfo?.longitude;
        
        urlParamsToReturn.set("latitude", (lat ?? 27.31).toString());
        urlParamsToReturn.set("longitude", (long ?? 102.2).toString());
        return urlParamsToReturn;
    }
    async function getEventDetails() {
        const urlParams = getUrlParams();
        const { eventDetails } = await eventsApiClient.getEventDetails(eventToViewId!, urlParams);

        setLoadedEventDetails(eventDetails);
        return eventDetails;
    }

    async function getNearbyEventByCurrentEvent(eventDetails: EventRecord) {
        console.log('eventDetails.citiesHosted', eventDetails.citiesHosted);
        const urlParams = getUrlParams();
        const { similarEvents } = await eventsApiClient.getNearbyEventByCurrentEvent(eventToViewId!, urlParams!);

        setLoadedSimilarEvents(similarEvents);
    }

    useEffect(() => {
        if(slug && eventToViewId) {
            getEventDetails()
                .then((ed) => getNearbyEventByCurrentEvent(ed));
        }

        return () => {
            setLoadedSimilarEvents(undefined);
            setLoadedEventDetails(undefined);
        }
    }, [slug]);

    if(!loadedEventDetails || !loadedSimilarEvents)
        return <CustomPageLoader title="Loading" />;

    return (
        <>
            <EventDetailsCard event={loadedEventDetails} />
            {loadedSimilarEvents && loadedSimilarEvents.length && <Marquee similarByDistance={true} typeOfMarquee={TypeOfMarquee.Event} marqueRecords={loadedSimilarEvents} />}
            {loadedEventDetails && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify({
                        "@context": "https://meet.alsaqr.app/",
                        "@type": "Event",
                        name: loadedEventDetails.name,
                        image: loadedEventDetails.images[0],
                        description: loadedEventDetails.description,
                        brand: {
                            "@type": "Brand",
                            name: "AlSaqr Zook",
                        },
                    }) }}
                    async
                />
            )}
        </>
    );
})