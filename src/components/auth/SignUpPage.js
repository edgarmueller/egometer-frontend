import React from "react";
import Button from "@material-ui/core/Button";
import _ from "lodash";
import { connect } from "react-redux";
import { routerActions } from "react-router-redux";
import mailValidator from "email-validator";

import SignUpForm from "./SignUpForm";
import { signUpWithEmail, resendVerificationMail } from "../../api";

const getError = (errorData, fieldName) => {
  if (errorData && _.has(errorData.details, `obj.${fieldName}`)) {
    const error = errorData.details[`obj.${fieldName}`][0].msg[0];
    if (error === "error.path.missing") {
      return "Field missing";
    }
    return error;
  }
  return null;
};

class SignUpPage extends React.Component {
  state = {
    name: undefined,
    mail: undefined,
    password: undefined,
    confirmationPassword: undefined,
    isLoading: false,
    success: undefined,
    errorMsg: undefined,
    errors: {},
  };

  handleUpdateName = (event) => {
    this.setState({
      name: event.target.value,
      errors: {
        ...this.state.errors,
        name: null,
      },
    });
  };

  handleUpdateEmail = (event) => {
    const value = event.target.value;
    const isValidMail = mailValidator.validate(value);
    this.setState({
      mail: value,
      errors: {
        ...this.state.errors,
        mail: isValidMail ? null : "Invalid mail address",
      },
    });
  };

  handleUpdatePassword = (event) => {
    this.setState({
      password: event.target.value,
      errors: {
        ...this.state.errors,
        password: null,
      },
    });
  };

  handleUpdateConfirmationPassword = (event) => {
    this.setState({
      confirmationPassword: event.target.value,
    });
  };

  handleSubmit = () => {
    this.setState({ isLoading: true });
    signUpWithEmail(this.state.name, this.state.mail, this.state.password).then(
      () =>
        this.setState({
          isLoading: false,
          success: true,
          errorMsg: null,
          errors: null,
        }),
      (error) => {
        const errorData = _.get(error, "response.data");
        const mail = getError(errorData, "email");
        const name = getError(errorData, "name");
        const password = getError(errorData, "password");
        this.setState({
          isLoading: false,
          success: false,
          errorMsg: "Invalid signup data",
          password: "",
          confirmationPassword: "",
          showResendVerification: error.response.status === 409,
          errors: {
            name,
            mail,
            password,
          },
        });
      }
    );
  };

  render() {
    if (this.state.isLoading) {
      return <div>Loading...</div>;
    }

    if (!this.state.isLoading && this.state.success) {
      return (
        <div>
          <p>Please check your email.</p>
          <p>You may close this window now</p>
        </div>
      );
    }

    if (!this.state.isLoading && this.state.error === false) {
      return <div>An error occurred while signing you up</div>;
    }

    return (
      <div>
        <h2>Sign up for egometer</h2>
        <SignUpForm
          name={this.state.name}
          mail={this.state.mail}
          handleSubmit={this.handleSubmit}
          handleUpdateName={this.handleUpdateName}
          handleUpdateEmail={this.handleUpdateEmail}
          handleUpdatePassword={this.handleUpdatePassword}
          handleUpdateConfirmationPassword={
            this.handleUpdateConfirmationPassword
          }
          errors={{
            ...this.state.errors,
            message: this.state.errorMsg,
            confirmationPassword:
              this.state.password !== this.state.confirmationPassword
                ? "Passwords do not match"
                : null,
          }}
        />
        {this.state.showResendVerification && (
          <>
            <p>
              You already signed up! Do you want to resend the verification mail
              instead?
            </p>
            <Button onClick={() => resendVerificationMail(this.state.mail)}>
              Resend verification mail
            </Button>
          </>
        )}
        {this.state.error && (
          <p style={{ paddingTop: "1em", color: "red" }}>{this.state.error}</p>
        )}
      </div>
    );
  }
}

SignUpPage.propTypes = {};

SignUpPage.defaultProps = {};

const mapDispatchToProps = {
  replace: routerActions.replace,
};

export default connect(null, mapDispatchToProps)(SignUpPage);
