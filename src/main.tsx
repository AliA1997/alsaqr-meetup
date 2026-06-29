
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { store } from '@stores/index.ts';
import { RouterProvider } from 'react-router';
import { router } from './router/index.tsx';


store.commonStore.loadIpInfo().then(() => console.log('loaded ip info'));
store.authStore.initializeFromStorage().then(() => console.log("Welcome to alsaqr"));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
