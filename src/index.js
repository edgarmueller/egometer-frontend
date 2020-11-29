import React from "react";
import ReactDOM from "react-dom";
import { ConnectedRouter } from "react-router-redux";
import Typography from "typography";
import grandViewTheme from "typography-theme-grand-view";
import "emoji-mart/css/emoji-mart.css";
import "./index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";
import { history } from "./store/configureStore";
import { checkToken } from "./common/util";
import DefaultErrorBoundary from "./components/common/DefaultErrorBoundary";
import { Auth0Provider } from "@auth0/auth0-react";

//import { createBrowserHistory } from "history";
//export default createBrowserHistory();
//const history = createBrowserHistory();

const typography = new Typography(grandViewTheme);
typography.injectStyles();

// eslint-disable-next-line no-undef
require("dotenv").config();

//if (process.env.NODE_ENV !== "production") {
//  const { whyDidYouUpdate } = require("why-did-you-update");
//  whyDidYouUpdate(React);
//}

const store = configureStore();

checkToken(store.dispatch);

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    clientId={config.clientId}
    audience={config.audience}
    redirectUri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
    useRefreshTokens={true}
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

serviceWorker.register();
