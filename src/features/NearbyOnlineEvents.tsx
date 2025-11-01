import Feed from "@components/shared/Feed";
import { TypeOfFeeds } from "@models/enums";

export default function NearbyOnlineEvents() {
    return (
        <Feed typeOfFeed={TypeOfFeeds.NearbyOnlineEvents} />
    );
}