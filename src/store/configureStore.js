import { compose, createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "react-router-redux";

import app from "../reducers";
import { createEpicMiddleware } from "redux-observable";
import { rootEpic } from "../epics";
import * as api from "../api";

export const history = createBrowserHistory();

const epicMiddleware = createEpicMiddleware(rootEpic, {
  dependencies: { api },
});
// eslint-disable-next-line no-undef
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = (initState) => {
  const middlewares = [thunk, epicMiddleware, routerMiddleware(history)];
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === "development") {
    middlewares.push(logger);
  }
  return createStore(
    app,
    initState,
    composeEnhancers(applyMiddleware(...middlewares))
  );
};

export default configureStore;
