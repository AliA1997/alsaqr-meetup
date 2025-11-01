import CustomPageLoader from "@common/CustomLoader";
import Marquee from "@components/shared/Marquee";
import LocalGuideDetailsCard from "@components/users/LocalGuideDetailsCard";
import { TypeOfMarquee } from "@models/enums";
import type { LocalGuideDetailsRecord, LocalGuideRecord } from "@models/localGuide";
import { useStore } from "@stores/index";
import { userApiClient } from "@utils/userApiClient";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router";


export default observer(() => {
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
        if(slug && localGuideToViewId) {
            getLocalGuidesDetails()
                .then((lgd) => getNearbyLocalGuidesByCurrentLocalGuide(lgd));
        }

        return () => {
            setLoadedSimilarLocalGuides(undefined);
            setLoadedLocalGuidesDetails(undefined);
        }
    }, [slug])

    if(!loadedLocalGuidesDetails)
        return <CustomPageLoader title="Loading" />;

    return (
        <>
            <LocalGuideDetailsCard localGuide={loadedLocalGuidesDetails} />
            {loadedSimilarLocalGuides && loadedSimilarLocalGuides.length && <Marquee similarByDistance={true} typeOfMarquee={TypeOfMarquee.LocalGuide} marqueRecords={loadedSimilarLocalGuides} />}
            {loadedSimilarLocalGuides && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify({
                        "@context": "https://meet.alsaqr.app/",
                        "@type": "Local Guides",
                        name: loadedLocalGuidesDetails.name,
                        image: loadedLocalGuidesDetails.userInfo.avatar,
                        description: loadedLocalGuidesDetails.userInfo.bio,
                        brand: {
                            "@type": "Brand",
                            name: "AlSaqr meet",
                        },
                    }) }}
                    async
                />
            )}
        </>
    );
})