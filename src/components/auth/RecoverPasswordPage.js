import React from "react";
import { connect } from "react-redux";
import { routerActions } from "react-router-redux";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { recoverPassword } from "../../api";
import RecoverPasswordForm from "./RecoverPasswordForm";
import LinkButton from "../LinkButton";

class RecoverPasswordPage extends React.Component {
  state = {
    isLoading: false,
    success: undefined,
    error: undefined,
  };

  handleFormSubmit = (mail) => {
    if (isEmpty(mail)) {
      this.setState({
        error: "Mail must not be empty",
      });
      return;
    }
    this.setState({ isLoading: true });
    recoverPassword(mail).then(
      (resp) => {
        this.setState({
          isLoading: false,
          success: true,
          error: undefined,
        });
      },
      (error) => {
        this.setState({
          isLoading: false,
          success: false,
          error: get(error, "response.data.description") || error.message,
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
          Please check your email.
          <p>
            <LinkButton to="/" label="Back to front page" />
          </p>
        </div>
      );
    }

    if (!this.state.isLoading && this.state.error === false) {
      return <div>An error occurred. Please try again later</div>;
    }

    return (
      <div>
        <h2>Welcome to egometer</h2>
        <RecoverPasswordForm handleFormSubmit={this.handleFormSubmit} />
        {this.state.error && (
          <p style={{ paddingTop: "1em", color: "red" }}>{this.state.error}</p>
        )}
      </div>
    );
  }
}

RecoverPasswordPage.propTypes = {};

RecoverPasswordPage.defaultProps = {};

const mapDispatchToProps = {
  replace: routerActions.replace,
};

export default connect(null, mapDispatchToProps)(RecoverPasswordPage);
