import React from "react";
import ReactDOM from "react-dom";
import { ConnectedRouter } from "react-router-redux";
import "./index.css";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";
import { history } from "./store/configureStore";
import { checkToken } from "./common/util";

require("dotenv").config();

const store = configureStore();

checkToken(store.dispatch);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
