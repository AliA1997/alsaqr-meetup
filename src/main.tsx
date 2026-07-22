
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { store } from '@stores/index.ts';
import { RouterProvider } from 'react-router';
import { router } from './router/index.tsx';

import {
  configureAlSaqr,

  // PagingParams,
// @ts-ignore: external URL import for runtime bundler
} from "https://cdn.jsdelivr.net/gh/AliA1997/alsaqr-core-web@v0.0.5/dist/alsaqr-web-core.js";


configureAlSaqr({
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey:  import.meta.env.VITE_SUPABASE_ANON_KEY,
    apiBaseUrl: import.meta.env.VITE_PUBLIC_BASE_API_URL,
    baseUrl: import.meta.env.VITE_PUBLIC_BASE_URL,
    zookUrl: import.meta.env.VITE_PUBLIC_ZOOK_URL,
    meetupUrl: import.meta.env.VITE_PUBLIC_MEETUP_URL,
    hfNsfwChecker: import.meta.env.VITE_PUBLIC_HUGGINGFACE_NSFW_CHECKER,
    hfToken: import.meta.env.VITE_PUBLIC_HUGGINGFACE_TOKEN,
    testMode: import.meta.env.VITE_DEBUG_MODE,
    locationApiUrl: import.meta.env.VITE_PUBLIC_IP_LOC_API,
    locationReverseApiUrl: import.meta.env.VITE_PUBLIC_REVERSE_LOC_API,
});

store.commonStore.loadIpInfo().then(() => console.log('loaded ip info'));
store.authStore.initializeFromStorage().then(() => console.log("Welcome to alsaqr"));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
