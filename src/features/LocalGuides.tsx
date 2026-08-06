import { SkeletonLoader } from "alsaqr-web-core";
import React from "react";

const LocalGuidesFeed = React.lazy(() => import("@components/users/LocalGuidesFeed"));


export default function LocalGuides() {
    return (
        <React.Suspense fallback={<SkeletonLoader count={6} />}>
            <LocalGuidesFeed />
        </React.Suspense>
    );
}