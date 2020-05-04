import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
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
      <Container maxWidth="xs">
        <Grid container spacing={3} justify="center">
          <Grid item xs={8}>
            <TextField
              required
              type="text"
              label="Mail Address"
              onChange={this.handleUpdateEmail}
              fullWidth
            />
          </Grid>
          <Grid item container justify="center">
            <Button
              type="submit"
              className={joinClasses(classes.button, classes.primaryButton)}
              onClick={() => handleFormSubmit(this.state.email)}
            >
              Reset Password
            </Button>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

RecoverPasswordForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(RecoverPasswordForm);
