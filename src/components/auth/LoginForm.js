import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";
import { primaryButton, button, joinClasses} from "../../common/styles";
import Link from "../Link";
import { CssBaseline } from "@material-ui/core";

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

  render() {
    const { classes, handleFormSubmit, renderAlert } = this.props;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <form
          className={classes.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleFormSubmit(this.state.user, this.state.password);
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                type="text"
                label="Mail address"
                onChange={this.handleUpdateUser}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                type="password"
                label="Password"
                onChange={this.handleUpdatePassword}
                fullWidth
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid
              container
              style={{ marginTop: "1em" }}
              spacing={2}
              alignItems="center"
            >
              <Grid item xs={4}>
                <Link to="/auth/recover/password" label="Forgot password?" />
              </Grid>
              <Grid item xs={4}>
                <Link to="/sign-up" label="No account yet?" />
              </Grid>
              <Grid item xs={4}>
                <Button
                  type="submit"
                  className={joinClasses(classes.button, classes.primaryButton)}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
            {renderAlert()}
          </Grid>
        </form>
      </Container>
    );
  }
}

LoginForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  renderAlert: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(LoginForm);
