import { createRoot } from 'react-dom/client';

import './index.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { App } from './App';


const GOOGLE_CLIENT_ID = "582663218789-f7ootqdqcddrjk62c5qs32evhkiid7ko.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
