import React from "react";
import ReactDOM from "react-dom";
import { ConnectedRouter } from "react-router-redux";
import { Provider } from "react-redux";
import Typography from "typography";
import grandViewTheme from "typography-theme-grand-view";
import "emoji-mart/css/emoji-mart.css";
import "./index.css";
import App from "./components/App";
import { configureStore } from "./store/configureStore";
import { history } from "./store/configureStore";
import DefaultErrorBoundary from "./components/common/DefaultErrorBoundary";
import { AuthProvider } from "./components/auth/AuthProvider";
import { rootEpic } from "./epics";

const typography = new Typography(grandViewTheme);
typography.injectStyles();

const { store, epicMiddleware } = configureStore();
epicMiddleware.run(rootEpic);

ReactDOM.render(
  <AuthProvider>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <DefaultErrorBoundary>
          <App />
        </DefaultErrorBoundary>
      </ConnectedRouter>
    </Provider>
  </AuthProvider>,
  // eslint-disable-next-line no-undef
  document.getElementById("root")
);
