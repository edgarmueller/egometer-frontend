import React from 'react';
import Radium from 'radium';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import {primaryButton, button, joinClasses} from "../../common/styles";

const RadiumLink = Radium(Link);

const styles = {
  primaryButton,
  button,
  secondaryButton: {
    color: '#333435'
  }
};

export class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      password: undefined,
    };
    this.handleUpdateUser = this.handleUpdateUser.bind(this);
    this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
  }

  handleUpdateUser(event) {
    this.setState({
      user: event.target.value,
    });
  }

  handleUpdatePassword(event) {
    this.setState({
      password: event.target.value,
    });
  }

  render() {
    const { classes, handleFormSubmit, renderAlert } = this.props;

    return (
      <div>
        <TextField
          required
          type="text"
          label="Mail Address"
          onChange={this.handleUpdateUser}
        />
        <br />
        <TextField
          required
          type="password"
          label="Password"
          onChange={this.handleUpdatePassword}
        />
        <br />

        <div style={{ marginTop: '1em' }}>
          <RadiumLink to="/auth/recover/password" className={joinClasses(classes.button, classes.secondaryButton)}>
            Forgot password?
          </RadiumLink>
          <RadiumLink to="/sign-up" className={joinClasses(classes.button, classes.secondaryButton)}>
            No account yet?
          </RadiumLink>
          <Button
            type="button"
            className={joinClasses(classes.button, classes.primaryButton)}
            onClick={() => handleFormSubmit(this.state.user, this.state.password)}
          >
            Login
          </Button>

          {renderAlert()}
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  renderAlert: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(LoginForm);