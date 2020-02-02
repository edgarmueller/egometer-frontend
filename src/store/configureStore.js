import { compose, createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import jwtDecode from "jwt-decode";
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux';

import app from '../reducers';
import {createEpicMiddleware} from 'redux-observable';
import {rootEpic} from "../epics";
import * as api from '../api'
import { USER_LOGGED_OUT } from '../actions';

export const history = createHistory();

const checkTokenExpirationMiddleware = store => next => action => {
  const token = localStorage.getItem("egometer.token");
  if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp < Date.now() / 1000) {
      localStorage.removeItem("egometer.token");
      localStorage.removeItem("egometer.role");
      store.dispatch({
        type: USER_LOGGED_OUT
      });
    }
  }
  next(action);
};

const epicMiddleware = createEpicMiddleware(rootEpic, { dependencies: { api }});
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = (initState) => {
  const middlewares = [
    thunk,
    epicMiddleware,
    checkTokenExpirationMiddleware,
    routerMiddleware(history)
  ];
  if (process.env.NODE_ENV === 'development') {
    middlewares.push(logger);
  }
  return createStore(
    app,
    initState,
    composeEnhancers(applyMiddleware(...middlewares)),
  );
};

export default configureStore;
