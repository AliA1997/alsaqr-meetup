import Feed from "@components/shared/Feed";
import { TypeOfFeeds } from "@models/enums";

export default function MyGroups() {
    return (
        <Feed typeOfFeed={TypeOfFeeds.MyGroups} />
    );
}