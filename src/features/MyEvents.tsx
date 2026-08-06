
const Feed = React.lazy(() => import("@components/shared/Feed"));
import { TypeOfFeeds } from "@models/enums";
import { AdminDashboardLink, SkeletonLoader } from "alsaqr-web-core";
import React from "react";

export default function MyEvents() {
    return (
        <React.Suspense fallback={<SkeletonLoader count={6} />}>
            <div className="flex w-full flex-col">
                <AdminDashboardLink />
                <Feed typeOfFeed={TypeOfFeeds.MyEvents} />
            </div>
        </React.Suspense>
    );
}
