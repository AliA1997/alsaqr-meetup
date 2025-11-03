import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@common/Carousels"; // make sure this path matches your actual file name
import EventCard from "@components/event/EventCard";
import GroupCard from "@components/group/GroupCard";
import LocalGuideCard from "@components/users/LocalGuideCard";
import { HowSimilarKeys, TypeOfMarquee } from "@models/enums";
import { EventRecord } from "@models/event";
import { GroupRecord } from "@models/group";
import { LocalGuideRecord } from "@models/localGuide";

interface MarqueeProps {
    marqueRecords: any[];
    typeOfMarquee: TypeOfMarquee;
    similarByDistance: boolean;
}

export default function Marquee({ marqueRecords, typeOfMarquee, similarByDistance }: MarqueeProps) {
    const indicateHowSimilar = (rec: any) => {
        if (similarByDistance) {
            let result: HowSimilarKeys;
            switch (rec.distanceKm) {
                case (rec.distanceKm > 500):
                    result = HowSimilarKeys.FarAway;
                    break;
                case (rec.distanceKm > 100):
                    result = HowSimilarKeys.SomewhatFar;
                    break;
                case (rec.distanceKm > 25):
                    result = HowSimilarKeys.Nearby;
                    break;
                default:
                    result = HowSimilarKeys.WalkingDistance;
                    break;
            }
            return result;
        }
        else {
            return  rec.descriptionSimilarity > 0.15 ? HowSimilarKeys.MostSimilar :  rec.descriptionSimilarity < 0.10 ? HowSimilarKeys.NotSimilar : HowSimilarKeys.KindaSimilar;
        }
    }
    return (
        <Carousel
            opts={{
                dragFree: true,
            }}
            orientation="horizontal"
            className="relative pb-[2rem]"
        >
            <CarouselContent className="-ml-2 px-2">
                {marqueRecords.map((marqueeRecord, index) => {
                    const howSimilar = indicateHowSimilar(marqueeRecord);
                    return (
                        <CarouselItem
                            key={index}
                            className="basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 md:pl-4 min-h-[15rem]"
                        >
                            {typeOfMarquee === TypeOfMarquee.Event
                                ? <EventCard 
                                    testId="similareventcard"
                                    event={marqueeRecord as EventRecord} 
                                    howSimilar={howSimilar} 
                                    showDistance={true} 
                                   />
                                : typeOfMarquee === TypeOfMarquee.LocalGuide
                                    ? <LocalGuideCard 
                                        testId="similarlocalguidecard"
                                        localGuide={marqueeRecord as LocalGuideRecord} 
                                        howSimilar={howSimilar}
                                      />
                                    : <GroupCard 
                                        testId="similargroupcard"
                                        group={marqueeRecord as GroupRecord} 
                                        howSimilar={howSimilar}
                                     />}
                        </CarouselItem>
                    );
                })}
            </CarouselContent>
        </Carousel>
    );
}