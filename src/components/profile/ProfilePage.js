import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { primaryButton, button } from "../../common/styles";
import withStyles from "@material-ui/core/styles/withStyles";
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

  render() {
    return (
      <div>
        <Typography variant="h5">Change your password</Typography>
        <Typography>Use the form below to change your password.</Typography>
        <br />
        <br />
        <div style={{ marginTop: "1em" }}>
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
};

const mapStateToProps = (state) => ({
  email: state.user.email,
});

const mapDispatchToProps = () => ({});

const styles = {
  primaryButton,
  button,
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
);
