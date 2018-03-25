import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import {button, joinClasses, primaryButton} from "../../common/styles";

const styles = {
  button,
  primaryButton
};

export class RecoverPasswordForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: undefined
    };
  }

  handleUpdateEmail = event => {
    this.setState({
      email: event.target.value,
    });
  };

  render() {
    const { classes, handleFormSubmit } = this.props;

    return (
      <div>
        <TextField
          required
          type="text"
          label="Mail Address"
          onChange={this.handleUpdateEmail}
        />
        <br />

        <div style={{ marginTop: '1em' }}>
            <Button
              type="submit"
              className={joinClasses(classes.button, classes.primaryButton)}
              onClick={() => handleFormSubmit(this.state.email)}
            >
              Reset Password
            </Button>
        </div>
      </div>
    );
  }
}

RecoverPasswordForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(RecoverPasswordForm);
