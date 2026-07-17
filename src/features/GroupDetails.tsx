import { SkeletonLoader } from "@common/CustomLoader";
import { MapView } from "@common/Map";
import GroupDetailsCard from "@components/group/GroupDetailsCard";
import GroupMemberCard from "@components/group/GroupMemberCard";
import Marquee from "@components/shared/Marquee";
import { useChangeTabTitle } from "@hooks/useChangeTabTitle";
import type { EntityMarker } from "@models/common";
import { TypeOfMarquee } from "@models/enums";
import type { EventRecord } from "@models/event";
import type { GroupMember, GroupRecord } from "@models/group";
import { useStore } from "@stores/index";
import { groupsApiClient } from "@utils/api/groupsApiClient";
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

    const [loadedGroupDetails, setLoadedGroupDetails] = useState<GroupRecord | undefined>(undefined);
    const [loadedPastEvents, setLoadedPastEvents] = useState<EventRecord[]>([]);
    const [loadedSimilarGroups, setLoadedSimilarGroups] = useState<GroupRecord[] | undefined>(undefined);
    // undefined while the members request is still in flight; the section renders a skeleton until it resolves.
    const [loadedGroupMembers, setLoadedGroupMembers] = useState<GroupMember[] | undefined>(undefined);

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
        const { groupDetails, events } = await groupsApiClient.getGroupDetails(slug!, urlParams);

        setLoadedGroupDetails(groupDetails);
        setLoadedPastEvents(events);
        return groupDetails;
    }

    async function getSimilarGroups(groupDetails: GroupRecord) {
        const urlParams = getUrlParams(groupDetails.latitude, groupDetails.longitude);
        const similarGroups  = await groupsApiClient.getSimilarGroups(slug!, urlParams!);

        setLoadedSimilarGroups(similarGroups);
    }

    async function getGroupMembers() {
        try {
            const {groupMembers} = await groupsApiClient.getGroupMembers(slug!);
            setLoadedGroupMembers(groupMembers ?? []);
        } catch (error) {
            // The roster is supplementary to the page, so a failure here empties the
            // section rather than leaving it stuck on the skeleton.
            console.error("Error fetching group members:", error);
            setLoadedGroupMembers([]);
        }
    }

    useEffect(() => {
        if(slug) {
            getGroupDetails()
                .then((gd) => getSimilarGroups(gd))
                .then(() => getGroupMembers());
        }

        return () => {
            setLoadedGroupDetails(undefined);
            setLoadedSimilarGroups(undefined);
            setLoadedGroupMembers(undefined);
        }
    }, [slug])

    useChangeTabTitle(loadedGroupDetails);

    const mainCoords: EntityMarker = useMemo(() => {

        if(!loadedGroupDetails?.latitude || !loadedGroupDetails?.longitude)
            return {
                id: loadedGroupDetails?.id ?? 0,
                latitude: userIpInfo?.latitude ?? 27.31,
                longitude: userIpInfo?.longitude ?? 102.2,
                name: loadedGroupDetails?.name ?? "",
            } as EntityMarker;
        else 
            return {
                id: loadedGroupDetails?.id ?? 0,
                latitude: loadedGroupDetails?.latitude ?? 27.31,
                longitude: loadedGroupDetails?.longitude ?? 102.2,
                name: loadedGroupDetails?.name ?? "",  
            } as EntityMarker;
    }, [loadedGroupDetails])


    if(!loadedGroupDetails || !loadedSimilarGroups)
        return <SkeletonLoader count={6} />;

    return (
        <div className="h-screen">
            <GroupDetailsCard group={loadedGroupDetails} onRefresh={getGroupDetails} />
            <div data-testid="groupmembers" className="flex flex-col text-left">
                <h3 className="text-xl font-bold md:text-xl pl-4">Members:</h3>
                {!loadedGroupMembers ? (
                    <SkeletonLoader count={3} />
                ) : loadedGroupMembers.length ? (
                    <div className="flex flex-wrap gap-3 p-4">
                        {loadedGroupMembers.map((member) => (
                            <GroupMemberCard key={member.id} member={member} />
                        ))}
                    </div>
                ) : (
                    <p className="pl-4 py-4 text-gray-600 dark:text-gray-400">No members yet</p>
                )}
            </div>
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