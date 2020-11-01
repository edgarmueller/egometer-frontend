import React from "react";
import { resetPassword, validateToken } from "../../api";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button/Button";
import TextField from "@material-ui/core/TextField/TextField";
import isEmpty from "lodash/isEmpty";
import { joinClasses, primaryButton, button } from "../../common/styles";

const styles = {
  primaryButton,
  button,
};

class ResetPasswordPage extends React.Component {
  state = {
    success: undefined,
    error: undefined,
    status: undefined,
  };

  componentDidMount() {
    const { match } = this.props;
    const token = match.params.token;
    validateToken(token).then(
      () => {
        this.setState({
          isValidToken: true,
          error: undefined,
        });
      },
      (error) => {
        this.setState({
          isValidToken: false,
          error: error.response.data.description,
        });
      }
    );
  }

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

  handleFormSubmit = async (currentPassword, newPassword, token) => {
    console.log("handleFormSubmit");
    this.setState({ isLoading: true });
    try {
      const resp = await resetPassword(currentPassword, newPassword, token);
      this.setState({
        isLoading: false,
        success: true,
        error: undefined,
      });
    } catch (error) {
      console.log("error", error);
      this.setState({
        isLoading: false,
        success: false,
        error: "An error occurred. Please try again later",
      });
    }
  };

  render() {
    const { match, classes } = this.props;
    const token = match.params.token;

    if (this.state.success) {
      return <p>Password has been reset</p>;
    }

    return (
      <div>
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
            onClick={() => {
              this.handleFormSubmit(
                this.state.currentPassword,
                this.state.password,
                token
              );
            }}
          >
            Reset password
          </Button>
          {!this.state.isValidToken ||
            (this.state.error && (
              <p style={{ paddingTop: "1em", color: "red" }}>
                {this.state.error}
              </p>
            ))}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ResetPasswordPage);
