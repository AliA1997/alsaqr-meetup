import Feed from "@components/shared/Feed";
import { TypeOfFeeds } from "@models/enums";

export default function NearbyGroups() {
    return (
        <Feed typeOfFeed={TypeOfFeeds.NearbyGroups} />
    );
}