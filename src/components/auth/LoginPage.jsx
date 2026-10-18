import React from "react";
import * as _ from "lodash";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import qs from "qs";
import Logo from "../layout/Logo";
import { withAuth } from "./AuthProvider";

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

  render() {
    const { location, auth } = this.props;
    const { email, password, isSignUp, isLoading, error } = this.state;

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
      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          px: 2,
          py: 4,
        }}
      >
        <Logo />
        <Card sx={{ width: "100%", maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" component="h1">
              {isSignUp ? "Create your account" : "Welcome back"}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
              {isSignUp
                ? "Start tracking your habits with egometer."
                : "Log in to continue tracking your habits."}
            </Typography>
            <Stack component="form" spacing={2} onSubmit={this.handleSubmit}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                required
                type="email"
                label="Email"
                autoComplete="email"
                value={email}
                onChange={(e) => this.setState({ email: e.target.value })}
                fullWidth
              />
              <TextField
                required
                type="password"
                label="Password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                slotProps={{
                  htmlInput: isSignUp ? { minLength: MIN_PASSWORD_LENGTH } : {},
                }}
                helperText={
                  isSignUp
                    ? `At least ${MIN_PASSWORD_LENGTH} characters`
                    : undefined
                }
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                loading={isLoading}
                fullWidth
              >
                {isSignUp ? "Sign up" : "Log in"}
              </Button>
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 3 }}
            >
              {isSignUp ? "Already have an account?" : "No account yet?"}{" "}
              <Link
                component="button"
                type="button"
                variant="body2"
                underline="hover"
                onClick={this.toggleMode}
                sx={{ fontWeight: 600, verticalAlign: "baseline" }}
              >
                {isSignUp ? "Log in" : "Sign up"}
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }
}

LoginPage.propTypes = {
  location: PropTypes.object,
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    login: PropTypes.func,
    signUp: PropTypes.func,
  }).isRequired,
};

export default withAuth(LoginPage);
