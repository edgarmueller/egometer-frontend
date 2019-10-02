import React, { Fragment } from "react";
import Radium from "radium";
import { Link } from "react-router-dom";
import { activateAccount } from "../../api";

const RadiumLink = Radium(Link);

class ActivateAccountPage extends React.Component {
  state = {
    success: false,
    status: undefined,
    isLoading: true
  };

  componentDidMount() {
    const { match } = this.props;
    activateAccount(match.params.token).then(
      resp =>
        this.setState({
          isLoading: false,
          success: true,
          status: resp.data
        }),
      error =>
        this.setState({
          isLoading: false,
          success: false,
          status: error
        })
    );
  }

  render() {
    if (this.state.success) {
      return (
        <Fragment>
          <h1>Account activated!</h1>
          You can now <RadiumLink to="/login">login</RadiumLink>.
        </Fragment>
      );
    } else if (this.state.isLoading) {
      return <h1>Loading... please wait</h1>;
    } else {
      return <h1>Account activation failed!</h1>;
    }
  }
}

export default ActivateAccountPage;
