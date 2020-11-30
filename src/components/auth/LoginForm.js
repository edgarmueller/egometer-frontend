import React from "react";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";
import { primaryButton, button, joinClasses } from "../../common/styles";
import { CssBaseline } from "@material-ui/core";
import { withAuth0 } from "@auth0/auth0-react";

const styles = (theme) => ({
  primaryButton,
  button,
  secondaryButton: {
    color: "#333435",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
});

export class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      password: undefined,
    };
    this.handleUpdateUser = this.handleUpdateUser.bind(this);
    this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
  }

  handleUpdateUser(event) {
    this.setState({
      user: event.target.value,
    });
  }

  handleUpdatePassword(event) {
    this.setState({
      password: event.target.value,
    });
  }

  logoutWithRedirect = () => {
    const { logout } = this.props.auth0;
    logout({
      // eslint-disable-next-line no-undef
      returnTo: window.location.origin,
    });
  };

  render() {
    const { classes, renderAlert } = this.props;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Grid item xs={12}>
          <Grid
            container
            style={{ marginTop: "1em" }}
            spacing={2}
            alignItems="center"
          >
            <Grid item xs={12}>
              <Button
                onClick={() => this.props.auth0.loginWithRedirect()}
                className={joinClasses(classes.button, classes.primaryButton)}
              >
                Login
              </Button>
            </Grid>
          </Grid>
          {renderAlert()}
        </Grid>
      </Container>
    );
  }
}

LoginForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  renderAlert: PropTypes.func.isRequired,
  classes: PropTypes.object,
  auth0: PropTypes.object,
};

export default withStyles(styles)(withAuth0(LoginForm));
