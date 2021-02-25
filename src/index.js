import React from "react";
import ReactDOM from "react-dom";
import { ConnectedRouter } from "react-router-redux";
import { Provider } from "react-redux";
import { Auth0Provider } from "@auth0/auth0-react";
import Typography from "typography";
import grandViewTheme from "typography-theme-grand-view";
import "emoji-mart/css/emoji-mart.css";
import "./index.css";
import App from "./components/App";
import configureStore from "./store/configureStore";
import { history } from "./store/configureStore";
import DefaultErrorBoundary from "./components/common/DefaultErrorBoundary";

const typography = new Typography(grandViewTheme);
typography.injectStyles();

// eslint-disable-next-line no-undef
require("dotenv").config();

const store = configureStore();

const onRedirectCallback = (appState) => {
  history.push(
    // eslint-disable-next-line no-undef
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    // eslint-disable-next-line no-undef
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    // eslint-disable-next-line no-undef
    clientId={process.env.REACT_APP_AUTH0_CLIENTID}
    // eslint-disable-next-line no-undef
    audience={process.env.REACT_APP_AUTH0_AUDIENCE}
    // eslint-disable-next-line no-undef
    redirectUri={process.env.REACT_APP_AUTH0_REDIRECT_URL}
    onRedirectCallback={onRedirectCallback}
    useRefreshTokens
    cacheLocation="localstorage"
  >
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <DefaultErrorBoundary>
          <App />
        </DefaultErrorBoundary>
      </ConnectedRouter>
    </Provider>
  </Auth0Provider>,
  // eslint-disable-next-line no-undef
  document.getElementById("root")
);
