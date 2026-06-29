import { SkeletonLoader } from "@common/CustomLoader";
import { MapView } from "@common/Map";
import GroupDetailsCard from "@components/group/GroupDetailsCard";
import Marquee from "@components/shared/Marquee";
import type { EntityMarker } from "@models/common";
import { TypeOfMarquee } from "@models/enums";
import type { EventRecord } from "@models/event";
import type { GroupRecord } from "@models/group";
import { useStore } from "@stores/index";
import { groupsApiClient } from "@utils/groupsApiClient";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";


export default observer(() => {
     const [activeMarker, setActiveMarker] = useState<{
        id: number;
        latitude: number;
        longitude: number;
    } | undefined>(undefined);
    const { commonStore, groupsFeedStore } = useStore();
    const { userIpInfo } = commonStore;
    const { groupToViewId } = groupsFeedStore;

    const [loadedGroupDetails, setLoadedGroupDetails] = useState<GroupRecord | undefined>(undefined);
    const [loadedPastEvents, setLoadedPastEvents] = useState<EventRecord[]>([]);
    const [loadedSimilarGroups, setLoadedSimilarGroups] = useState<GroupRecord[] | undefined>(undefined);

    const { slug } = useParams();

    const getUrlParams = (latitude?: number, longitude?: number) => {
        let urlParamsToReturn = new URLSearchParams();
        const lat = latitude ? latitude : userIpInfo?.latitude;
        const long = longitude ? longitude : userIpInfo?.longitude;

        urlParamsToReturn.set("latitude", (lat ?? 27.31).toString());
        urlParamsToReturn.set("longitude", (long ?? 102.2).toString());
        return urlParamsToReturn;
    }

    async function getGroupDetails() {
        const urlParams = getUrlParams();
        const { groupDetails, events } = await groupsApiClient.getGroupDetails(groupToViewId!, urlParams);

        setLoadedGroupDetails(groupDetails);
        setLoadedPastEvents(events);
        return groupDetails;
    }

    async function getSimilarGroups(groupDetails: GroupRecord) {
        const urlParams = getUrlParams(groupDetails.latitude, groupDetails.longitude);
        const similarGroups  = await groupsApiClient.getSimilarGroups(groupToViewId!, urlParams!);

        setLoadedSimilarGroups(similarGroups);
    }

    useEffect(() => {
        if(slug && groupToViewId) {
            getGroupDetails()
                .then((gd) => getSimilarGroups(gd));
        }

        return () => {
            setLoadedGroupDetails(undefined);
            setLoadedSimilarGroups(undefined);
        }
    }, [slug])

    const mainCoords: EntityMarker = useMemo(() => {
        if(!loadedGroupDetails?.latitude || !loadedGroupDetails?.longitude)
            return {
                id: loadedGroupDetails?.id ?? 0,
                latitude: userIpInfo?.latitude ?? 27.31,
                longitude: userIpInfo?.longitude ?? 102.2,
                name: loadedGroupDetails?.name ?? "",
            };
        else 
            return {
                id: loadedGroupDetails.id ?? 0,
                latitude: loadedGroupDetails.latitude,
                longitude: loadedGroupDetails.longitude,
                name: loadedGroupDetails.name ?? "",  
            };
    }, [loadedGroupDetails])


    if(!loadedGroupDetails || !loadedSimilarGroups)
        return <SkeletonLoader count={6} />;

    return (
        <div className="h-screen">
            <GroupDetailsCard group={loadedGroupDetails} onRefresh={getGroupDetails} />
            <div className="flex flex-col">
                {loadedPastEvents && loadedPastEvents.length ? (
                    <div className="flex flex-col text-left">
                        <h3 className="text-xl font-bold md:text-xl pl-4">Past Events:</h3>
                        <Marquee similarByDistance={false} typeOfMarquee={TypeOfMarquee.Event} marqueRecords={loadedPastEvents} />
                    </div>
                ) : null}
            </div>
            <MapView
                mainCoords={mainCoords}
                forWhat="group"
                similarRecords={loadedSimilarGroups}
                setActiveMarker={setActiveMarker}
                activeMarker={activeMarker}
            />
            {loadedSimilarGroups && loadedSimilarGroups.length && (
                <div data-testid="similargroupsmarquee" className="flex flex-col text-left">
                    <h3 className="text-xl font-bold md:text-xl pl-4">Similar Groups:</h3>
                    <Marquee similarByDistance={true} typeOfMarquee={TypeOfMarquee.Group} marqueRecords={loadedSimilarGroups} />
                </div>
            )}
            {loadedGroupDetails && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify({
                        "@context": "https://meet.alsaqr.app/",
                        "@type": "Group",
                        name: loadedGroupDetails.name,
                        image: loadedGroupDetails.images[0],
                        description: loadedGroupDetails.description,
                        brand: {
                            "@type": "Brand",
                            name: "AlSaqr Meet",
                        },
                    }) }}
                    async
                />
            )}
        </div>
    );
})