import { HowSimilarKeys } from "@models/enums";

export const ROUTES_USER_CANT_ACCESS = [
  '/communities',
  '/bookmarks',
  '/lists',
  '/messages',
  '/notifications',
  '/my-groups',
  '/my-events',
  '/admin'
];

export const ROUTES_WIDGETS_HIDDEN = [
  "/messages"
]

export const MAX_BIO_LENGTH_FEED = 40;

export const ROUTE_TO_SHOW_SETTINGS_SIDEBAR = '/settings';

export const DELETE_YOUR_ACCOUNT = 'Delete Your Account';


export const INVITATION_EXPIRE_TIME = (24 * 60 * 60 * 1000) * 3

export const FALLBACK_IMAGE_URL = "https://res.cloudinary.com/aa1997/image/upload/v1720130142/Web3-Client-Projects/Gm.png";

export const FALLBACK_NEWS_IMAGE_URL = "/explore-news-placeholder.svg";

export const FALLBACK_POST_IMAGE_URL = "/post-placeholder.svg";


export const HOW_SIMILAR_LABEL_MAP = {
  [HowSimilarKeys.NotSimilar]: { text: "Not a Match", color: "danger" },
  [HowSimilarKeys.KindaSimilar]: { text: "Ok Match", color: "info" },
  [HowSimilarKeys.MostSimilar]: { text: "Good Match", color: "success" },
  [HowSimilarKeys.FarAway]: { text: "Not a Match", color: "danger" },
  [HowSimilarKeys.SomewhatFar]: { text: "Ok Match", color: "warning" },
  [HowSimilarKeys.Nearby]: { text: "Good Match", color: "info" },
  [HowSimilarKeys.WalkingDistance]: { text: "Good Match", color: "success" }
};

export const NOT_ALLOWED_NSFW_CHECKER_RESULTS = {
  "Somewhat Explicit": 'Somewhat Explicit',
  'Very Explicit': 'Very Explicit'
};


export const OAUTH_OPTIONS = {
  redirectTo: import.meta.env.VITE_PUBLIC_MEETUP_URL
}

// Base of a user's profile on the main AlSaqr site: `${ALSAQR_PROFILE_BASE}/${username}`.
export const ALSAQR_PROFILE_BASE = `${import.meta.env.VITE_PUBLIC_ALSAQR_URL}/users`;