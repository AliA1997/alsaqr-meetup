import { useEffect, useMemo, useRef, useState } from 'react';
import L, { DragEndEvent, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { EntityMarker } from '@models/common';
import type { GroupRecord } from '@models/group';
import type { EventRecord } from '@models/event';
import EventCard from '@components/event/EventCard';
import GroupCard from '@components/group/GroupCard';
import { openGoogleMaps } from '@utils/functions';
import { ButtonLoader } from './CustomLoader';

type MapViewProps = {
    forWhat: "group" | "event";
    mainCoords: EntityMarker;
    classNames?: string;
    similarRecords?: GroupRecord[] | EventRecord[];
    setActiveMarker: (marker: { id: string | number, latitude: number, longitude: number }) => void;
    activeMarker: { id: string | number, latitude: number, longitude: number } | undefined;
    onlyDisplay?: boolean;
};

export function MapView({
    forWhat,
    mainCoords,
    classNames,
    similarRecords,
    setActiveMarker,
    activeMarker,
    onlyDisplay
}: MapViewProps) {
    const [mounted, setMounted] = useState<boolean>(false);
    const mapRef = useRef<L.Map | null>(null);

    const [activeRecordToDisplay, setActiveRecordToDisplay] = useState<GroupRecord | EventRecord | undefined>(undefined);
    const mapCoords: LatLngTuple = useMemo(() => {
        return activeMarker && activeMarker.latitude
            ? [activeMarker.latitude, activeMarker.longitude]
            : [mainCoords.latitude, mainCoords.longitude]
    }, [activeMarker]);

    function initializeMap() {
        if(onlyDisplay)
            mapRef.current = L.map('map', {
                dragging: false,
                doubleClickZoom: false,
                boxZoom: false,
                keyboard: false,
                scrollWheelZoom: false,
            }).setView(mapCoords, 12);
        else
            mapRef.current = L.map('map').setView(mapCoords, 12);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '',
            subdomains: 'alsaqr-zook',
            maxZoom: 19
        }).addTo(mapRef.current);

        const mainMarker = L.marker([mainCoords.latitude, mainCoords.longitude], {
            icon: L.icon({
                iconUrl: 'https://img.icons8.com/3d-fluency/94/marker.png',
                iconSize: [30, 30],
                iconAnchor: [15, 30],
            }),
        });
        mainMarker.on('click', () => {
            setActiveMarker({
                id: mainCoords.id,
                latitude: mainCoords.latitude,
                longitude: mainCoords.longitude
            });
        });
        mainMarker.on('dblclick', () => {
            openGoogleMaps(mainCoords.latitude, mainCoords.longitude);
        });
        mainMarker.bindPopup(`
            <strong>${mainCoords.name}</strong><br/>
        `);

        mainMarker.addTo(mapRef.current)

        // Define similar record markers
        if (similarRecords)
            (similarRecords as any[]).forEach((sRec) => {
                let [recordLatitude, recordLongitude] = [sRec.latitude, sRec.longitude]
                if(forWhat === 'event') {
                    recordLatitude = (sRec as EventRecord).citiesHosted 
                                        && (sRec as EventRecord).citiesHosted.length > 0 
                                        ? (sRec as EventRecord).citiesHosted[(sRec as EventRecord).citiesHosted.length -1].latitude : null;
                    recordLongitude = (sRec as EventRecord).citiesHosted 
                                        && (sRec as EventRecord).citiesHosted.length > 0 
                                        ? (sRec as EventRecord).citiesHosted[(sRec as EventRecord).citiesHosted.length -1].longitude : null;
                }
                console.log("recordLatitude", recordLatitude)
                console.log("recordLongitude", recordLongitude)

                if(recordLatitude && recordLongitude) {
                    const marker = L.circleMarker([recordLatitude, recordLongitude], {
                        radius: 6,
                        color: 'white',
                        weight: 2,
                        fillColor: 'blue',
                        fillOpacity: 1,
                    });
    
                    marker.bindPopup(`
                        <strong>${sRec.title}</strong><br/>
                    `);
    
    
                    marker.on('click', () => {
                        setActiveMarker({
                            id: sRec.id,
                            latitude: recordLatitude,
                            longitude: recordLongitude
                        });
                    });
                    marker.on('dblclick', () => {
                        openGoogleMaps(recordLatitude, recordLongitude);
                    });
    
    
                    marker.addTo(mapRef.current!);

                }
            });
    }

    useEffect(() => {
        
    
        if(!mapRef.current)
            initializeMap();

        setMounted(true);

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, [mainCoords, similarRecords, setActiveMarker, activeMarker]);


    useEffect(() => {
        const selectedRecordInMap = similarRecords ? similarRecords.find(s => s.id === activeMarker?.id) : undefined;
        setActiveRecordToDisplay(selectedRecordInMap ? Object.assign({}, selectedRecordInMap) : undefined);
    }, [activeMarker]);

    if (!mounted)
        <ButtonLoader />

    return (
        <div className='relative'>
            <div className={`w-[100%] h-[25rem] z-[10] ${classNames && classNames}`} id="map" />
            {activeRecordToDisplay ? (
                forWhat === "event" ?
                    <EventCard 
                        testId="similarmapeventcard"
                        event={activeRecordToDisplay as EventRecord} 
                        showDistance={true} 
                        classNames={"h-96 absolute top-0 right-0 z-[50]"}
                        imageClassNames={"h-48 w-48"}
                    />
                : 
                    <GroupCard 
                        testId="similarmapgroupcard"
                        group={activeRecordToDisplay as GroupRecord} 
                        showDistance={true} 
                        classNames={"h-96 absolute top-0 right-0 z-[50]"}
                        imageClassNames={"h-48 w-48"}
                    />
            ) : null}

        </div>
    );
}

type DraggableMapProps = {
    setActiveMarker: (marker: { latitude: number, longitude: number }) => void;
    activeMarker: { latitude: number, longitude: number };
    mapId: string;
}

export function DraggableMap({
    setActiveMarker,
    activeMarker,
    mapId
}: DraggableMapProps) {
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        let map = null;
        if (mounted) {

            map = L.map(mapId).setView([activeMarker?.latitude, activeMarker?.longitude], 12);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '',
                subdomains: 'alsaqr-zook',
                maxZoom: 19
            }).addTo(map);

            const mainMarker = L.marker([activeMarker?.latitude, activeMarker?.longitude], {
                icon: L.icon({
                    iconUrl: 'https://img.icons8.com/3d-fluency/94/marker.png',
                    iconSize: [30, 30],
                    iconAnchor: [15, 30],
                }),
                draggable: true
            });

            mainMarker.on('dragend', (ev: DragEndEvent) => {
                setActiveMarker({
                    latitude: ev.target._latlng['lat'],
                    longitude: ev.target._latlng['lng'],
                })
            })

            mainMarker.addTo(map)
        }

        return () => {
            if (map)
                map.remove();
        };
    }, [mounted]);

    if (!mounted)
        return <ButtonLoader />;

    return (
        <div className='w-[100%] h-[25rem]' id={mapId} />
    );
}