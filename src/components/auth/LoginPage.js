import React from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import PropTypes from "prop-types";
import { routerActions } from "react-router-redux";
import { withAuth0 } from "@auth0/auth0-react";
import qs from "qs";

import LoginForm from "../../components/auth/LoginForm";
import { loginWithEmail } from "../../actions";

export class LoginPage extends React.Component {
  constructor() {
    super();
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
  }

  handleFormSubmit(mail, password) {
    this.props.loginUser(mail, password);
  }

  renderAlert() {
    if (this.props.error) {
      return (
        <div style={{ marginTop: "1em" }}>
          <span style={{ color: "red" }}>{this.props.error}</span>
        </div>
      );
    }

    return undefined;
  }

  render() {
    const { location, auth0 } = this.props;
    const { isAuthenticated, isLoading } = auth0;
    let redirectUrl;
    if (location) {
      const search = location.search;
      const params = qs.parse(search);
      redirectUrl = params["redirect"];
    }

    if (isAuthenticated) {
      return (
        <Redirect to={`${_.isEmpty(redirectUrl) ? "/meters" : redirectUrl}`} />
      );
    }

    return (
      <div>
        <h2>Welcome to egometer</h2>
        <LoginForm
          handleFormSubmit={this.handleFormSubmit}
          renderAlert={this.renderAlert}
        />
        {isLoading && <p style={{ paddingTop: "1em" }}>Logging you in...</p>}
      </div>
    );
  }
}

LoginPage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isAuthenticating: PropTypes.bool.isRequired,
  loginUser: PropTypes.func.isRequired,
  error: PropTypes.string,
  location: PropTypes.object,
  auth0: PropTypes.object,
};

LoginPage.defaultProps = {
  error: undefined,
};

const mapStateToProps = (state) => {
  const isAuthenticated = state.user.isAuthenticated || false;
  const isAuthenticating = state.user.isLoading || false;
  const error = state.user.error ? state.user.error : undefined;
  return {
    isAuthenticated,
    isAuthenticating,
    error,
  };
};

const mapDispatchToProps = {
  loginUser: loginWithEmail,
  replace: routerActions.replace,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuth0(LoginPage));
