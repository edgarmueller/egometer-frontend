import React from "react";
import * as _ from "lodash";
import { Redirect } from "react-router";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import qs from "qs";
import Loading from "../common/Loading";
import { primaryButton, joinClasses } from "../../common/styles";
import { withAuth } from "./AuthProvider";

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

const MIN_PASSWORD_LENGTH = 8;

const errorMessage = (error, isSignUp) => {
  const status = _.get(error, "response.status");
  if (status === 401) {
    return "Invalid email or password.";
  }
  if (status === 409) {
    return "An account with this email already exists.";
  }
  if (status === 403 && isSignUp) {
    return "Sign-up is disabled.";
  }
  if (status === 400) {
    return isSignUp
      ? `Please enter a valid email and a password with at least ${MIN_PASSWORD_LENGTH} characters.`
      : "Please enter a valid email and password.";
  }
  return "Something went wrong, please try again.";
};

export class LoginPage extends React.Component {
  state = {
    email: "",
    password: "",
    isSignUp: false,
    isLoading: false,
    error: undefined,
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { auth } = this.props;
    const { email, password, isSignUp } = this.state;
    this.setState({ isLoading: true, error: undefined });
    try {
      await (isSignUp ? auth.signUp : auth.login)(email, password);
    } catch (error) {
      this.setState({
        isLoading: false,
        error: errorMessage(error, isSignUp),
      });
    }
  };

  toggleMode = () => {
    this.setState(({ isSignUp }) => ({
      isSignUp: !isSignUp,
      error: undefined,
    }));
  };

  renderAlert() {
    const error = this.state.error || this.props.error;
    if (error) {
      return (
        <div style={{ marginTop: "1em" }}>
          <span style={{ color: "red" }}>{error}</span>
        </div>
      );
    }

    return undefined;
  }

  render() {
    const { location, auth, classes } = this.props;
    const { email, password, isSignUp, isLoading } = this.state;

    if (auth.isAuthenticated) {
      const params = location
        ? qs.parse(location.search, { ignoreQueryPrefix: true })
        : {};
      const redirectUrl = params.redirect;
      // only follow app-internal redirects
      const isInternal =
        _.isString(redirectUrl) &&
        redirectUrl.startsWith("/") &&
        !redirectUrl.startsWith("//");
      return <Redirect to={isInternal ? redirectUrl : "/meters"} />;
    }

    return (
      <Container component="main" maxWidth="xs">
        <h2>Welcome to egometer</h2>
        <form className={classes.form} onSubmit={this.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                type="email"
                label="Email"
                autoComplete="email"
                value={email}
                onChange={(e) => this.setState({ email: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                type="password"
                label="Password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                inputProps={isSignUp ? { minLength: MIN_PASSWORD_LENGTH } : {}}
                helperText={
                  isSignUp
                    ? `At least ${MIN_PASSWORD_LENGTH} characters`
                    : undefined
                }
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={joinClasses(
                      classes.button,
                      classes.primaryButton
                    )}
                  >
                    {isSignUp ? "Sign up" : "Login"}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    onClick={this.toggleMode}
                    className={classes.secondaryButton}
                  >
                    {isSignUp ? "Have an account?" : "No account yet?"}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
        {isLoading && <Loading />}
        {this.renderAlert()}
      </Container>
    );
  }
}

LoginPage.propTypes = {
  error: PropTypes.string,
  location: PropTypes.object,
  classes: PropTypes.object,
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    login: PropTypes.func,
    signUp: PropTypes.func,
  }).isRequired,
};

LoginPage.defaultProps = {
  error: undefined,
  classes: {},
};

export default withStyles(styles)(withAuth(LoginPage));
