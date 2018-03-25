import React from 'react'
import { activateAccount } from '../../api'

class ActivateAccountPage extends React.Component {

  state = {
    success: false,
    status: undefined,
    isLoading: true
  };

  componentDidMount() {
    const { match } = this.props;
    activateAccount(match.params.token).then(
      resp => this.setState({
        isLoading: false,
        success: true,
        status: resp.data
      }),
      error => this.setState({
        isLoading: false,
        success: false,
        status: error
      })
    )
  }

  render() {
    if (this.state.success) {
      return (
        <h1>Account activated!</h1>
      );
    } else if (!this.state.success) {
      return (
        <h1>Account activation failed!</h1>
      );
    } else {
      return (
        <h1>Loading...</h1>
      )
    }
  }
}


export default ActivateAccountPage;
