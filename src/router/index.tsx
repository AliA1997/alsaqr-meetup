import { createBrowserRouter, RouteObject } from "react-router-dom";

import App from '../App';
import HomePage from "@features/Home";
import Messages from "@features/Messages";
import Notifications from "@features/Notifications";
import NearbyGroups from "@features/NearbyGroups";
import NearbyEvents from "@features/NearbyEvents";
import NearbyOnlineEvents from "@features/NearbyOnlineEvents";
import MyEvents from "@features/MyEvents";
import MyGroups from "@features/MyGroups";
import LocalGuides from "@features/LocalGuides";
import GroupDetails from "@features/GroupDetails";
import EventDetails from "@features/EventDetails";
import LocalGuideDetails from "@features/LocalGuideDetails";

export const routes: RouteObject[] = [
  {
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/notifications', element: <Notifications /> },
      { path: '/messages', element: <Messages /> },
      { path: '/groups', element: <NearbyGroups /> },
      { path: '/groups/:slug', element: <GroupDetails /> },
      { path: '/events', element: <NearbyEvents /> },
      { path: '/events/:slug', element: <EventDetails /> },
      { path: '/online-events', element: <NearbyOnlineEvents /> },
      { path: '/my-events', element: <MyEvents /> },
      { path: '/my-groups', element: <MyGroups  /> },
      { path: '/local-guides', element: <LocalGuides  /> },
      { path: '/local-guides/:slug', element: <LocalGuideDetails  /> },
    ],
  },
]

export const router = createBrowserRouter(routes);