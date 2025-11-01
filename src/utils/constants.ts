import { Margin, Options, Resolution } from "react-to-pdf";
import { HowSimilarKeys } from "@models/enums";

export const ROUTES_USER_CANT_ACCESS = [
  '/communities',
  '/bookmarks',
  '/lists',
  '/messages',
  '/notifications'
];

export const ROUTES_WIDGETS_HIDDEN = [
  "/messages"
]

export const MAX_BIO_LENGTH_FEED = 40;

export const ROUTE_TO_SHOW_SETTINGS_SIDEBAR = '/settings';

export const DELETE_YOUR_ACCOUNT = 'Delete Your Account';

export const REACT_TO_PDF_CONFIG: Options = {
   // default is `save`
   method: 'open',
   // default is Resolution.MEDIUM = 3, which should be enough, higher values
   // increases the image quality but also the size of the PDF, so be careful
   // using values higher than 10 when having multiple pages generated, it
   // might cause the page to crash or hang.
   resolution: Resolution.HIGH,
   page: {
      // margin is in MM, default is Margin.NONE = 0
      margin: Margin.LARGE,
      // default is 'A4'
      format: 'letter',
      // default is 'portrait'
      orientation: 'portrait',
   },
   canvas: {
      // default is 'image/jpeg' for better size performance
      mimeType: 'image/png',
      qualityRatio: 1,
   },
   // Customize any value passed to the jsPDF instance and html2canvas
   // function. You probably will not need this and things can break, 
   // so use with caution.
   overrides: {
      // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
      pdf: {
         compress: true
      },
      // see https://html2canvas.hertzen.com/configuration for more options
      canvas: {
         useCORS: true
      }
   },
};

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