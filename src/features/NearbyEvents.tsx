import Feed from "@components/shared/Feed";
import { TypeOfFeeds } from "@models/enums";

export default function NearbyEvents() {
    return (
        <Feed typeOfFeed={TypeOfFeeds.NearbyEvents} />
    );
}