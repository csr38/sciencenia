import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Routing from './Commons/Routing.jsx';
import { Auth0Provider } from '@auth0/auth0-react';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{ 
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE }}
        useRefreshTokens={true}
        cacheLocation="localstorage">
      <Routing />
    </Auth0Provider>
  </React.StrictMode>
);