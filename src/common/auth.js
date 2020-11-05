import React from "react";
import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";
import connectedAuthWrapper from "redux-auth-wrapper/connectedAuthWrapper";
import * as routerActions from "react-router-redux";
import LoginPage from "../components/auth/LoginPage";

const locationHelper = locationHelperBuilder({});

// export const userIsAuthenticated = connectedAuthWrapper(userIsAuthenticatedDefaults)
export const userIsAuthenticated = connectedRouterRedirect({
  authenticatedSelector: (state) => state.user.isAuthenticated,
  authenticatingSelector: (state) => state.user.isLoading,
  wrapperDisplayName: "UserIsAuthenticated",
  AuthenticatingComponent: <LoginPage />,
  redirectPath: "/login",
});

export const userIsAdminRedir = connectedRouterRedirect({
  redirectPath: "/",
  allowRedirectBack: false,
  authenticatedSelector: (state) => state.user.isAdmin,
  predicate: (user) => user.isAdmin,
  wrapperDisplayName: "UserIsAdmin",
});

/**
 * This HOC is responsible for handling the redirect after
 * a user has been authenticated.
 */
export const userIsNotAuthenticated = connectedRouterRedirect({
  // If selector is true, wrapper will not redirect, so we show the page
  authenticatedSelector: (state) => state.user.isAuthenticated === false,
  wrapperDisplayName: "UserIsNotAuthenticated",
  // This sends the user either to the query param route if we have one,
  // or to the index page if none is specified and the user is already logged in
  redirectPath: (state, ownProps) => {
    return locationHelper.getRedirectQueryParam(ownProps) || "/";
  },
  redirectAction: routerActions.replace,
  // This prevents us from adding the query parameter when we send the user away from the login page
  allowRedirectBack: false,
});

export const visibleOnlyAdmin = connectedAuthWrapper({
  authenticatedSelector: (state) => state.user !== null && state.user.isAdmin,
  wrapperDisplayName: "VisibleOnlyAdmin",
});
