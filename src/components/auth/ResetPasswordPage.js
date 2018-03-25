import React from 'react'
import {resetPassword, validateToken} from '../../api'
import withStyles from '@material-ui/core/styles/withStyles'
import Button from "@material-ui/core/Button/Button";
import TextField from "@material-ui/core/TextField/TextField";
import {joinClasses, primaryButton, button} from "../../common/styles";

const styles = {
  primaryButton,
  button
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
          error: undefined
        })
      },
      error => {
        this.setState({ 
          isValidToken: false,
          error: error.response.data.description 
        })
      }
    )
  }

  handleUpdatePassword = (event) => {
    this.setState({
      password: event.target.value,
    })
  };

  handleUpdateConfirmationPassword = event => {
    this.setState({
      confirmationPassword: event.target.value,
    });
  };

  handleFormSubmit = (token, password) => {
    this.setState({ isLoading: true });
    resetPassword(token, password)
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
            error: error.response.data.description
          })
        }
      )
  };


  render() {

    const { match, classes } = this.props;
    const token = match.params.token;

    if (this.state.success) {
      return (<p>Password has been reset</p>)
    }

    if (!this.state.isValidToken || this.state.error) {
      return (<p style={{ paddingTop: '1em', color: 'red' }}>{this.state.error}</p>);
    }

    return (
      <div>
        <TextField
          required
          type="password"
          label="Password"
          onChange={this.handleUpdatePassword}
        />
        <br />
        <TextField
          required
          type="password"
          label="Confirm Password"
          onChange={this.handleUpdateConfirmationPassword}
        />
        <br />

        <div style={{ marginTop: '1em' }}>
          <Button
            type="button"
            className={joinClasses(classes.button, classes.primaryButton)}
            onClick={() => {
              this.handleFormSubmit(token, this.state.password)}
            }>
            Reset password
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ResetPasswordPage);
