import React from "react";
import { Redirect } from "react-router";
import PropTypes from "prop-types";
import qs from "qs";
import { useAuth } from "./AuthProvider";

/**
 * Renders the wrapped component if the user is logged in, otherwise
 * redirects to the login page and back after logging in.
 */
const requireAuth = (Component) => {
  const RequireAuth = (props) => {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) {
      return <Component {...props} />;
    }
    const { location } = props;
    const returnTo = location
      ? `${location.pathname}${location.search || ""}`
      : undefined;
    const search =
      returnTo && returnTo !== "/"
        ? qs.stringify({ redirect: returnTo }, { addQueryPrefix: true })
        : "";
    return <Redirect to={`/login${search}`} />;
  };
  RequireAuth.propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string,
      search: PropTypes.string,
    }),
  };
  RequireAuth.displayName = `RequireAuth(${
    Component.displayName || Component.name || "Component"
  })`;
  return RequireAuth;
};

export default requireAuth;
