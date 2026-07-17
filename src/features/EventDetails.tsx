import { SkeletonLoader } from "@common/CustomLoader";
import { MapView } from "@common/Map";
import EventDetailsCard from "@components/event/EventDetailsCard";
import GroupMemberCard from "@components/group/GroupMemberCard";
import Marquee from "@components/shared/Marquee";
import { useChangeTabTitle } from "@hooks/useChangeTabTitle";
import { EntityMarker } from "@models/common";
import { TypeOfMarquee } from "@models/enums";
import type { EventMember, EventRecord } from "@models/event";
import { useStore } from "@stores/index";
import { eventsApiClient } from "@utils/api/eventsApiClient";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";


export default observer(() => {
    const [activeMarker, setActiveMarker] = useState<{
        id: string | number;
        latitude: number;
        longitude: number;
    } | undefined>(undefined);
    const { commonStore } = useStore();
    const { userIpInfo } = commonStore;

    const [loadedEventDetails, setLoadedEventDetails] = useState<EventRecord | undefined>(undefined);
    const [loadedSimilarEvents, setLoadedSimilarEvents] = useState<EventRecord[] | undefined>(undefined);
    // undefined while the members request is still in flight; the section renders a skeleton until it resolves.
    const [loadedEventMembers, setLoadedEventMembers] = useState<EventMember[] | undefined>(undefined);

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
        const { eventDetails } = await eventsApiClient.getEventDetails(slug!, urlParams);

        setLoadedEventDetails(eventDetails);
        return eventDetails;
    }

    async function getNearbyEventByCurrentEvent() {
        const urlParams = getUrlParams();
        const { similarEvents } = await eventsApiClient.getNearbyEventByCurrentEvent(slug!, urlParams!);

        setLoadedSimilarEvents(similarEvents);
    }

    async function getEventMembers() {
        try {
            const { eventMembers } = await eventsApiClient.getEventMembers(slug!);
            setLoadedEventMembers(eventMembers ?? []);
        } catch (error) {
            // The roster is supplementary to the page, so a failure here empties the
            // section rather than leaving it stuck on the skeleton.
            console.error("Error fetching event members:", error);
            setLoadedEventMembers([]);
        }
    }

    useEffect(() => {
        if (slug) {
            getEventDetails()
                .then(() => getNearbyEventByCurrentEvent())
                .then(() => getEventMembers());
        }

        return () => {
            setLoadedSimilarEvents(undefined);
            setLoadedEventDetails(undefined);
            setLoadedEventMembers(undefined);
            setActiveMarker(undefined)
        }
    }, [slug]);

    useChangeTabTitle(loadedEventDetails);

    const mainCoords: EntityMarker = useMemo(() => {
        const eventCoords = loadedEventDetails ? loadedEventDetails?.citiesHosted[loadedEventDetails?.citiesHosted.length - 1] : undefined;

        if (!eventCoords?.latitude || !eventCoords?.longitude)
            return {
                id: loadedEventDetails?.id ?? 0,
                latitude: userIpInfo?.latitude ?? 27.31,
                longitude: userIpInfo?.longitude ?? 102.2,
                name: loadedEventDetails?.name ?? "",
            } as EntityMarker;
        else
            return {
                id: loadedEventDetails?.id ?? 0,
                latitude: eventCoords.latitude,
                longitude: eventCoords.longitude,
                name: loadedEventDetails?.name ?? "",
            } as EntityMarker;

    }, [loadedEventDetails])

    if (!loadedEventDetails || !loadedSimilarEvents)
        return <SkeletonLoader count={6} />;

    console.log(JSON.stringify(loadedEventDetails));
    return (
        <>
            <EventDetailsCard event={loadedEventDetails} onRefresh={getEventDetails} />
            <div data-testid="eventmembers" className="flex flex-col text-left">
                <h3 className="text-xl font-bold md:text-xl pl-4">Members:</h3>
                {!loadedEventMembers ? (
                    <SkeletonLoader count={3} />
                ) : loadedEventMembers.length ? (
                    <div className="flex flex-wrap gap-3 p-4">
                        {loadedEventMembers.map((member) => (
                            <GroupMemberCard key={member.userId} member={member} />
                        ))}
                    </div>
                ) : (
                    <p className="pl-4 py-4 text-gray-600 dark:text-gray-400">No members yet</p>
                )}
            </div>
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
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://meet.alsaqr.app/",
                            "@type": "Event",
                            name: loadedEventDetails.name,
                            image: loadedEventDetails.images[0],
                            description: loadedEventDetails.description,
                            brand: {
                                "@type": "Brand",
                                name: "AlSaqr Zook",
                            },
                        })
                    }}
                    async
                />
            )}
        </>
    );
})