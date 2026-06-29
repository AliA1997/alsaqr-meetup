import { SkeletonLoader } from "@common/CustomLoader";
import { MapView } from "@common/Map";
import EventDetailsCard from "@components/event/EventDetailsCard";
import Marquee from "@components/shared/Marquee";
import { EntityMarker } from "@models/common";
import { TypeOfMarquee } from "@models/enums";
import type { EventRecord } from "@models/event";
import { useStore } from "@stores/index";
import { eventsApiClient } from "@utils/eventsApiClient";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";


export default observer(() => {
    const [activeMarker, setActiveMarker] = useState<{
        id: number;
        latitude: number;
        longitude: number;
    } | undefined>(undefined);
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

    async function getNearbyEventByCurrentEvent() {
        const urlParams = getUrlParams();
        const { similarEvents } = await eventsApiClient.getNearbyEventByCurrentEvent(eventToViewId!, urlParams!);

        setLoadedSimilarEvents(similarEvents);
    }

    useEffect(() => {
        if(slug && eventToViewId) {
            getEventDetails()
                .then(() => getNearbyEventByCurrentEvent());
        }

        return () => {
            setLoadedSimilarEvents(undefined);
            setLoadedEventDetails(undefined);
            setActiveMarker(undefined)
        }
    }, [slug]);

    const mainCoords: EntityMarker = useMemo(() => {
        const eventCoords =  loadedEventDetails ? loadedEventDetails?.citiesHosted[loadedEventDetails?.citiesHosted.length - 1] : undefined;

        if(!eventCoords?.latitude || !eventCoords?.longitude)
            return {
                id: loadedEventDetails?.id ?? 0,
                latitude: userIpInfo?.latitude ?? 27.31,
                longitude: userIpInfo?.longitude ?? 102.2,
                name: loadedEventDetails?.name ?? "",
            };
        else 
            return {
                id: loadedEventDetails?.id ?? 0,
                latitude: eventCoords.latitude,
                longitude: eventCoords.longitude,
                name: loadedEventDetails?.name ?? "",  
            };

    }, [loadedEventDetails])

    if(!loadedEventDetails || !loadedSimilarEvents)
        return <SkeletonLoader count={6} />;

    return (
        <>
            <EventDetailsCard event={loadedEventDetails} onRefresh={getEventDetails} />
            <MapView 
                mainCoords={mainCoords}
                forWhat="event"
                similarRecords={loadedSimilarEvents}
                setActiveMarker={setActiveMarker}
                activeMarker={activeMarker}
            />
            {loadedSimilarEvents && loadedSimilarEvents.length && (
                <div data-testid="similareventsmarquee" className="flex flex-col text-left">
                    <h3 className="text-xl font-bold md:text-xl pl-4">Similar Events:</h3>
                    <Marquee similarByDistance={true} typeOfMarquee={TypeOfMarquee.Event} marqueRecords={loadedSimilarEvents} />
                </div>
            )}
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