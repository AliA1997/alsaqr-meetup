import Feed from "@components/shared/Feed";
import { TypeOfFeeds } from "@models/enums";
import AdminDashboardLink from "@common/AdminDashboardLink";

export default function MyEvents() {
    return (
        <div className="flex w-full flex-col">
            <AdminDashboardLink />
            <Feed typeOfFeed={TypeOfFeeds.MyEvents} />
        </div>
    );
}
