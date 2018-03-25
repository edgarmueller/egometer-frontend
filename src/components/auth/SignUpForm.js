import React from 'react';
import Radium from 'radium';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';

const RadiumLink = Radium(Link);

const styles = {
  button: {
    textDecoration: 'none',
    color: '#333435',
    paddingLeft: '1em',
    paddingRight: '1em',
    display: 'inline-flex',
    marginLeft: '1em',
    marginRight: '1em',
    height: '36px',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#80CBC4',
      color: '#fff',
    },
    alignItems: 'center',
    textTransform: 'uppercase',
    fontSize: '0.8em',
    letterSpacing: '0.065em',
  },
};

export class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: undefined,
      email: undefined,
      password: undefined,
      confirmationPassword: undefined
    };
  }

  handleUpdateName = event => {
    this.setState({
      name: event.target.value
    })
  };

  handleUpdateEmail = event => {
    this.setState({
      email: event.target.value,
    });
  };

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

  render() {
    const { classes, handleFormSubmit } = this.props;

    return (
      <div>
        <TextField
          required
          type="text"
          label="Name"
          onChange={this.handleUpdateName}
        />
        <br />
        <TextField
          required
          type="text"
          label="Mail Address"
          onChange={this.handleUpdateEmail}
        />
        <br />
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
            <RadiumLink to="/auth/recover/password" className={classes.button}>
              I already have an account
            </RadiumLink>
            <Button
              type="submit"
              className={classes.button}
              onClick={() => handleFormSubmit(this.state.name, this.state.email, this.state.password)}
            >
              Sign Up
            </Button>
        </div>
      </div>
    );
  }
}

SignUpForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(SignUpForm);
