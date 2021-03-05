/* eslint-disable no-undef */
import React from "react";
import { withAuth0 } from "@auth0/auth0-react";
import PropTypes from "prop-types";

class PeriodicAuthCheck extends React.Component {
  constructor(props) {
    super(props);
    // interval in seconds, every 10 mins
    this.interval = 10 * 60;
  }

  refresh = () => {
    const { auth0 } = this.props;
    const { getAccessTokenSilently, isAuthenticated } = auth0;
    if (isAuthenticated) {
      getAccessTokenSilently();
    }
  };

  componentDidMount() {
    this.interval = setInterval(this.refresh, this.interval * 1000);
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

export default withAuth0(PeriodicAuthCheck);
