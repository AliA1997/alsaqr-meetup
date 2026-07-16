import { SkeletonLoader } from "@common/CustomLoader";
import { MapView } from "@common/Map";
import Marquee from "@components/shared/Marquee";
import LocalGuideDetailsCard from "@components/users/LocalGuideDetailsCard";
import { EntityMarker } from "@models/common";
import { TypeOfMarquee } from "@models/enums";
import type { LocalGuideDetailsRecord, LocalGuideRecord } from "@models/localGuide";
import { useStore } from "@stores/index";
import { userApiClient } from "@utils/userApiClient";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";


export default observer(() => {
    const [activeMarker, setActiveMarker] = useState<{
        id: string | number;
        latitude: number;
        longitude: number;
    } | undefined>(undefined);
    const { commonStore, localGuidesFeedStore } = useStore();
    const { userIpInfo } = commonStore;
    const { localGuideToViewId } = localGuidesFeedStore;

    const [loadedLocalGuidesDetails, setLoadedLocalGuidesDetails] = useState<LocalGuideDetailsRecord | undefined>(undefined);
    const [loadedSimilarLocalGuides, setLoadedSimilarLocalGuides] = useState<LocalGuideRecord[] | undefined>(undefined);

    const { slug } = useParams();
    const getUrlParams = (latitude?: number, longitude?: number) => {
        let urlParamsToReturn = new URLSearchParams();
        const lat = latitude ? latitude : userIpInfo?.latitude;
        const long = longitude ? longitude : userIpInfo?.longitude;

        urlParamsToReturn.set("latitude", (lat ?? 27.31).toString());
        urlParamsToReturn.set("longitude", (long ?? 102.2).toString());
        return urlParamsToReturn;
    }
    async function getLocalGuidesDetails() {
        const urlParams = getUrlParams();
        const { localGuideDetails } = await userApiClient.getLocalGuideDetails(localGuideToViewId!, urlParams);

        setLoadedLocalGuidesDetails(localGuideDetails);
        return localGuideDetails;
    }

    async function getNearbyLocalGuidesByCurrentLocalGuide(localGuideDetails: LocalGuideDetailsRecord) {
        const hostedCity = (localGuideDetails.hostedCities ?? []).length > 0 ? localGuideDetails.hostedCities[0] : userIpInfo;
        const urlParams = getUrlParams(hostedCity?.latitude ?? 31.5, hostedCity?.longitude ?? 31.5);
        const { similarLocalGuides } = await userApiClient.getNearbyLocalGuidesByCurrentLocalGuide(localGuideToViewId!, urlParams!);

        setLoadedSimilarLocalGuides(similarLocalGuides);
    }

    useEffect(() => {
        if (slug && localGuideToViewId) {
            getLocalGuidesDetails()
                .then((lgd) => getNearbyLocalGuidesByCurrentLocalGuide(lgd));
        }

        return () => {
            setLoadedSimilarLocalGuides(undefined);
            setLoadedLocalGuidesDetails(undefined);
        }
    }, [slug])

    const mainCoords: EntityMarker = useMemo(() => {
        const localGuideCoords = loadedLocalGuidesDetails ? loadedLocalGuidesDetails?.citiesHosted[loadedLocalGuidesDetails?.citiesHosted.length - 1] : undefined;

        if (!localGuideCoords?.latitude || !localGuideCoords?.longitude)
            return {
                id: loadedLocalGuidesDetails?.id ?? 0,
                latitude: userIpInfo?.latitude ?? 27.31,
                longitude: userIpInfo?.longitude ?? 102.2,
                name: loadedLocalGuidesDetails?.name ?? "",
            };
        else
            return {
                id: loadedLocalGuidesDetails?.id ?? 0,
                latitude: localGuideCoords.latitude,
                longitude: localGuideCoords.longitude,
                name: loadedLocalGuidesDetails?.name ?? "",
            };

    }, [loadedLocalGuidesDetails])

    if (!loadedLocalGuidesDetails)
        return <SkeletonLoader count={6} />;

    return (
        <>
            <LocalGuideDetailsCard
                localGuide={loadedLocalGuidesDetails}
                mainCoords={mainCoords}
            />
            <MapView
                mainCoords={mainCoords}
                forWhat="event"
                setActiveMarker={setActiveMarker}
                activeMarker={activeMarker}
                onlyDisplay={true}
            />
            {loadedSimilarLocalGuides && loadedSimilarLocalGuides.length && (
                <div data-testid="similarlocalguidesmarquee" className="flex flex-col text-left">
                    <Marquee similarByDistance={true} typeOfMarquee={TypeOfMarquee.LocalGuide} marqueRecords={loadedSimilarLocalGuides} />
                </div>
            )}
            {loadedSimilarLocalGuides && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://meet.alsaqr.app/",
                            "@type": "Local Guides",
                            name: loadedLocalGuidesDetails.name,
                            image: loadedLocalGuidesDetails.userInfo.avatar,
                            description: loadedLocalGuidesDetails.userInfo.bio,
                            brand: {
                                "@type": "Brand",
                                name: "AlSaqr meet",
                            },
                        })
                    }}
                    async
                />
            )}
        </>
    );
})