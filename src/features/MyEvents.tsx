import Feed from "@components/shared/Feed";
import { TypeOfFeeds } from "@models/enums";

export default function MyEvents() {
    return (
        <Feed typeOfFeed={TypeOfFeeds.MyEvents} />
    );
}