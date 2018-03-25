import React from 'react';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';

import SignUpForm from "./SignUpForm";
import {signUpWithEmail} from "../../api";

class SignUpPage extends React.Component {

  state = {
    isLoading: false,
    success: undefined,
    error: undefined
  };

  handleFormSubmit = (name, mail, password) => {
    this.setState({ isLoading: true });
    signUpWithEmail(name, mail, password)
      .then(
        () => this.setState({
          isLoading: false,
          success: true,
          error: undefined
        }),
        error => {
          this.setState({
            isLoading: false,
            success: false,
            error: error.response.data.description || error.response.statusText
          })
        }
      )
  };

  render() {
    if (this.state.isLoading) {
      return (<div>Loading...</div>)
    }

    if (!this.state.isLoading && this.state.success) {
      return <div>Please check your email</div>
    }

    if (!this.state.isLoading && this.state.error === false) {
      return <div>An error occurred while signing you up</div>
    }

    return (
      <div>
        <h2 style={{ paddingTop: '1em' }}>Welcome to egometer</h2>
        <SignUpForm
          handleFormSubmit={this.handleFormSubmit}
        />
        {
          this.state.error && (<p style={{ paddingTop: '1em', color: 'red' }}>{this.state.error}</p>)
        }
      </div>
    );
  }
}

SignUpPage.propTypes = {

};

SignUpPage.defaultProps = {

};

const mapDispatchToProps = {
  replace: routerActions.replace,
};

export default connect(
  null,
  mapDispatchToProps,
)(SignUpPage);
