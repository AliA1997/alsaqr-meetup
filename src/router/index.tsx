import { createBrowserRouter, RouteObject } from "react-router-dom";

import App from '../App';
import HomePage from "@features/Home";
// import Clothing from "@features/Clothing";
// import Electronics from "@features/Electronics";
// import OfficeSupplies from "@features/OfficeSupplies";
// import PetSupplies from "@features/PetSupplies";
// import Rentals from "@features/Rentals";
// import SportingGoods from "@features/SportingGoods";
// import ToysAndGames from "@features/ToysAndGames";
// import Vehicles from "@features/Vehicles";
// import ListingPage from "@features/ListingPage";
// import Buying from "@features/Buying";
// import Selling from "@features/Selling";
import Messages from "@features/Messages";
import Notifications from "@features/Notifications";
import NearbyGroups from "@features/NearbyGroups";
import NearbyEvents from "@features/NearbyEvents";
import NearbyOnlineEvents from "@features/NearbyOnlineEvents";
import MyEvents from "@features/MyEvents";
import MyGroups from "@features/MyGroups";
import LocalGuides from "@features/LocalGuides";

export const routes: RouteObject[] = [
  {
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/notifications', element: <Notifications /> },
      { path: '/messages', element: <Messages /> },
      { path: '/groups', element: <NearbyGroups /> },
      { path: '/events', element: <NearbyEvents /> },
      { path: '/online-events', element: <NearbyOnlineEvents /> },
      { path: '/my-events', element: <MyEvents /> },
      { path: '/my-groups', element: <MyGroups  /> },
      { path: '/local-guides', element: <LocalGuides  /> },
    ],
  },
]

export const router = createBrowserRouter(routes);