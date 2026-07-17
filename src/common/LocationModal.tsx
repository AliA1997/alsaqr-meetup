import { observer } from "mobx-react-lite";
import { ModalBody, ModalPortal } from "./Modal";
import { useStore } from "@stores/index";
import { useCallback, useEffect, useState } from "react";
import { DraggableMap } from "./Map";
import { locationApiClient } from "@utils/api/locationApiClient";
import { CheckIcon, ClipboardCopyIcon } from "@heroicons/react/solid";


export const LocationModal = observer(() => {
    const { commonStore, modalStore } = useStore();
    const { setUserIpInfo, userIpInfo } = commonStore;
    const { closeModal } = modalStore;
    const [activeMarker, setActiveMarker] = useState<{ latitude: number, longitude: number }>({ latitude: userIpInfo?.latitude ?? 31.5, longitude: userIpInfo?.longitude ?? 39.39 })
    const [locationToDisplay, setLocationToDisplay] = useState<{ cityCountry: string, latitude: number, longitude: number, displayName: string } | undefined>();
    const [copied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        if (activeMarker)
            locationApiClient.reverseLocateAddress(activeMarker.latitude, activeMarker.longitude)
                .then(reverseLocData => {
                    const locationFeatures = reverseLocData && reverseLocData["features"] && reverseLocData["features"].length ? reverseLocData["features"][0] : undefined;

                    if (locationFeatures) {
                        setLocationToDisplay({
                            cityCountry: `
                                ${locationFeatures["properties"]["address"]["state"] ?? locationFeatures["properties"]["address"]["province"] ?? locationFeatures["properties"]["address"]["city"]},
                                ${locationFeatures["properties"]["address"]["country"]}
                            `,
                            latitude: locationFeatures["geometry"]["coordinates"][1],
                            longitude: locationFeatures["geometry"]["coordinates"][0],
                            displayName: locationFeatures["properties"]["display_name"],
                        });
                    } else {
                        setLocationToDisplay(undefined);
                    }
                })
    }, [activeMarker, setActiveMarker]);

    const onClose = useCallback(() => {
        if (locationToDisplay) {
            setUserIpInfo({
                locationDisplayName: locationToDisplay.cityCountry,
                latitude: locationToDisplay.latitude,
                longitude: locationToDisplay.longitude
            })
        }
        closeModal();
    }, [locationToDisplay]);

    const copyLocation = useCallback(() => {
        if (locationToDisplay?.displayName) {
            navigator.clipboard.writeText(locationToDisplay.displayName)
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    }, [locationToDisplay]);

    return (
        <ModalPortal>
            <ModalBody
                headerChildren={(
                    <div className='d-flex w-full'>
                        <p className='font-bold text-xl'>Set Your Current Location:</p>
                        <button
                            onClick={onClose}
                            style={{ background: 'transparent' }}
                            className="absolute right-5 top-3 text-gray-400 hover:text-gray-600 block float-right"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                )}
                onClose={onClose}
                style={{ background: 'transparent' }}
            >
                <div className='flex flex-col justify-center' data-testid="locationmodal">
                    <DraggableMap
                        activeMarker={activeMarker}
                        setActiveMarker={setActiveMarker}
                        mapId="location-modal-map"
                    />
                    <div className="relative">
                        <textarea
                            rows={2}
                            readOnly
                            onClick={copyLocation}
                            className={`
                                relative
                                flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                dark:bg-gray-900
                                w-[100%]
                                resize-none cursor-pointer
                                text-xs md:text-[0.9rem]
                            `}
                            placeholder="Location is displayed"
                            value={locationToDisplay ? locationToDisplay.displayName : ""}
                        />
                        {copied ? (
                            <CheckIcon className="absolute bottom-2 right-3 h-4 w-4 md:h-6 md:w-6 text-green-400" />
                        ) : (
                            <ClipboardCopyIcon
                                className="absolute bottom-2 right-3 h-4 w-4 md:h-6 md:w-6 cursor-pointer"
                                onClick={copyLocation}
                            />
                        )}
                    </div>

                </div>
            </ModalBody>
        </ModalPortal>
    );
});