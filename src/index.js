import React from "react";
import ReactDOM from "react-dom";
import { ConnectedRouter } from "react-router-redux";
import "./index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";
import { history } from "./store/configureStore";
import { checkToken } from "./common/util";
import DefaultErrorBoundary from "./components/common/DefaultErrorBoundary";

require("dotenv").config();

//if (process.env.NODE_ENV !== "production") {
//  const { whyDidYouUpdate } = require("why-did-you-update");
//  whyDidYouUpdate(React);
//}

const store = configureStore();

checkToken(store.dispatch);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <DefaultErrorBoundary>
        <App />
      </DefaultErrorBoundary>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.register();
