import React from "react";
import * as _ from "lodash";
import { Redirect } from "react-router";
import PropTypes from "prop-types";
import { withAuth0 } from "@auth0/auth0-react";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import qs from "qs";
import Loading from "../common/Loading";
import { primaryButton, joinClasses } from "../../common/styles";

const styles = (theme) => ({
  primaryButton,
  secondaryButton: {
    color: "#333435",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
});

export class LoginPage extends React.Component {
  constructor() {
    super();
    this.renderAlert = this.renderAlert.bind(this);
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
    const { location, auth0, classes } = this.props;
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
      <>
        <h2>Welcome to egometer</h2>
        <Button
          onClick={() => this.props.auth0.loginWithRedirect()}
          className={joinClasses(classes.button, classes.primaryButton)}
        >
          Login
        </Button>
        {isLoading && <Loading />}
        {this.renderAlert()}
      </>
    );
  }
}

LoginPage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isAuthenticating: PropTypes.bool.isRequired,
  error: PropTypes.string,
  location: PropTypes.object,
  classes: PropTypes.object,
  auth0: PropTypes.object,
};

LoginPage.defaultProps = {
  error: undefined,
};

export default withStyles(styles)(withAuth0(LoginPage));
