/* eslint-disable no-undef */
import React from "react";
import { withAuth0 } from "@auth0/auth0-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class PeriodicAuthCheck extends React.Component {
  constructor(props) {
    super(props);
    // interval in seconds
    this.interval = 10;
  }

  authCheck = () => () => {
    const { auth0 } = this.props;
    const { isAuthenticated, logout } = auth0;
    if (!isAuthenticated) {
      if (window.location.hash !== window.location.origin) {
        logout();
      }
    }
  };

  componentDidMount() {
    this.authCheck(window.location.origin);
    this.interval = setInterval(this.authCheck, this.interval * 1000);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  render() {
    return null;
  }
}

PeriodicAuthCheck.propTypes = {
  auth0: PropTypes.object,
};

const mapStateToProps = (state) => ({
  token: state.user.token,
});

export default connect(mapStateToProps)(withAuth0(PeriodicAuthCheck));
