import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import Link from "../../components/Link";
import { button, joinClasses, primaryButton } from "../../common/styles";
import { CssBaseline } from "@material-ui/core";

const styles = {
  button,
  primaryButton,
};

export class RecoverPasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: undefined,
    };
  }

  handleUpdateEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  render() {
    const { classes, handleFormSubmit } = this.props;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              type="text"
              label="Mail address"
              onChange={this.handleUpdateEmail}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container alignItems="center">
              <Grid item xs={6}>
                <Link to="/" label="Back to front page" />
              </Grid>
              <Grid item xs={6}>
                <Button
                  className={joinClasses(classes.button, classes.primaryButton)}
                  onClick={() => handleFormSubmit(this.state.email)}
                >
                  Reset Password
                </Button>
              </Grid>
            </Grid>
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
