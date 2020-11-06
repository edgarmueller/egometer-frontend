import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { joinClasses, primaryButton, button } from "../../common/styles";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import { resetPasswordWithEmail } from "../../api";
import { logout } from "../../actions";
import { Typography } from "@material-ui/core";

class ProfilePage extends React.Component {
  state = {
    success: undefined,
    error: undefined,
    status: undefined,
  };

  handleUpdateCurrentPassword = (event) => {
    const password = event.target.value;
    this.setState({
      currentPassword: password,
      currentPasswordError:
        (isEmpty(password) && "Confirmation is empty") || undefined,
    });
  };

  handleUpdatePassword = (event) => {
    const password = event?.target?.value;
    this.setState((s) => {
      const passwordsMatch = password === s.confirmationPassword;
      return {
        password,
        passwordError:
          (isEmpty(password) && "Confirmation is empty") || undefined,
        confirmPasswordError:
          (!passwordsMatch && "Passwords do not match") || undefined,
      };
    });
  };

  handleUpdateConfirmationPassword = (event) => {
    const confirmationPassword = event?.target?.value;
    this.setState((s) => {
      const passwordsMatch = s.password === confirmationPassword;
      return {
        confirmationPassword,
        confirmPasswordError:
          (!passwordsMatch && "Passwords do not match") || undefined,
      };
    });
  };

  handleFormSubmit = async (email, currentPassword, newPassword) => {
    this.setState({ isLoading: true });
    try {
      const success = await resetPasswordWithEmail(
        currentPassword,
        newPassword,
        email
      );
      this.setState({
        isLoading: false,
        success: true,
        error: undefined,
      });
      return success;
    } catch (error) {
      this.setState({
        isLoading: false,
        success: false,
        error: error.response.data.message,
      });
      return false;
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography variant="h5">Change your password</Typography>
        <Typography>Use the form below to change your password.</Typography>
        <br />
        <TextField
          required
          type="password"
          label="Current Password"
          onChange={this.handleUpdateCurrentPassword}
          style={{ width: "25ch" }}
        />
        <br />
        <TextField
          required
          type="password"
          label="New password"
          onChange={this.handleUpdatePassword}
          error={!isEmpty(this.state.passwordError)}
          helperText={this.state.passwordError}
          style={{ width: "25ch" }}
        />
        <br />
        <TextField
          required
          type="password"
          label="Confirm new password"
          onChange={this.handleUpdateConfirmationPassword}
          error={!isEmpty(this.state.confirmPasswordError)}
          helperText={this.state.confirmPasswordError}
          style={{ width: "25ch" }}
        />
        <br />
        <div style={{ marginTop: "1em" }}>
          <Button
            type="button"
            className={joinClasses(classes.button, classes.primaryButton)}
            onClick={async () => {
              const success = await this.handleFormSubmit(
                this.props.email,
                this.state.currentPassword,
                this.state.password
              );
              if (success) {
                this.props.logout();
              }
            }}
          >
            Reset password
          </Button>
          <br />
          {!this.state.success && (
            <div style={{ color: "red" }}>{this.state.error}</div>
          )}
        </div>
      </div>
    );
  }
}

ProfilePage.propTypes = {
  classes: PropTypes.object.isRequired,
  email: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  email: state.user.email,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});

const styles = {
  primaryButton,
  button,
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
);
