import { compose, createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "react-router-redux";

import app from "../reducers";
import { createEpicMiddleware } from "redux-observable";
import * as api from "../api";

export const history = createBrowserHistory();

// eslint-disable-next-line no-undef
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const configureStore = (initState) => {
  const epicMiddleware = createEpicMiddleware({
    dependencies: { api },
  });
  const middlewares = [thunk, epicMiddleware, routerMiddleware(history)];
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === "development") {
    middlewares.push(logger);
  }
  return {
    store: createStore(
      app,
      initState,
      composeEnhancers(applyMiddleware(...middlewares))
    ),
    epicMiddleware,
  };
};
