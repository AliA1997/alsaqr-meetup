import { lazy, ReactNode, Suspense } from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import { SuspenseLoader } from "alsaqr-web-core";

import App from '../App';

// Every feature is a route-level page, so each one is its own async chunk. Only the
// page the user actually navigates to gets downloaded.
const HomePage = lazy(() => import("@features/Home"));
const Messages = lazy(() => import("@features/Messages"));
const Notifications = lazy(() => import("@features/Notifications"));
const NearbyGroups = lazy(() => import("@features/NearbyGroups"));
const NearbyEvents = lazy(() => import("@features/NearbyEvents"));
const NearbyOnlineEvents = lazy(() => import("@features/NearbyOnlineEvents"));
const MyEvents = lazy(() => import("@features/MyEvents"));
const MyGroups = lazy(() => import("@features/MyGroups"));
const LocalGuides = lazy(() => import("@features/LocalGuides"));
const GroupDetails = lazy(() => import("@features/GroupDetails"));
const EventDetails = lazy(() => import("@features/EventDetails"));
const LocalGuideDetails = lazy(() => import("@features/LocalGuideDetails"));
const AdminDashboard = lazy(() => import("@features/AdminDashboard"));

// Each route owns its own boundary so a chunk still in flight shows the loader
// instead of unmounting the surrounding layout.
const withSuspense = (page: ReactNode) => (
  <Suspense fallback={<SuspenseLoader />}>{page}</Suspense>
);

export const routes: RouteObject[] = [
  {
    element: <App />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: '/notifications', element: withSuspense(<Notifications />) },
      { path: '/messages', element: withSuspense(<Messages />) },
      { path: '/groups', element: withSuspense(<NearbyGroups />) },
      { path: '/groups/:slug', element: withSuspense(<GroupDetails />) },
      { path: '/events', element: withSuspense(<NearbyEvents />) },
      { path: '/events/:slug', element: withSuspense(<EventDetails />) },
      { path: '/online-events', element: withSuspense(<NearbyOnlineEvents />) },
      { path: '/admin', element: withSuspense(<AdminDashboard />) },
      { path: '/my-events', element: withSuspense(<MyEvents />) },
      { path: '/my-groups', element: withSuspense(<MyGroups />) },
      { path: '/local-guides', element: withSuspense(<LocalGuides />) },
      { path: '/local-guides/:slug', element: withSuspense(<LocalGuideDetails />) },
    ],
  },
]

export const router = createBrowserRouter(routes);
