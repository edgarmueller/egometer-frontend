import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import { primaryButton, button, joinClasses } from "../../common/styles";
import LinkButton from "../../components/LinkButton";

const styles = {
  primaryButton,
  button,
  secondaryButton: {
    color: "#333435",
  },
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit(this.state.user, this.state.password);
        }}
      >
        <TextField
          required
          type="text"
          label="Mail address"
          onChange={this.handleUpdateUser}
          style={{ width: 300 }}
        />
        <br />
        <TextField
          required
          type="password"
          label="Password"
          onChange={this.handleUpdatePassword}
          style={{ width: 300 }}
        />
        <br />

        <div style={{ marginTop: "1em" }}>
          <LinkButton to="/auth/recover/password" label="Forgot password?" />
          <LinkButton to="/sign-up" label="No account yet?" />
          <Button
            type="submit"
            className={joinClasses(classes.button, classes.primaryButton)}
          >
            Login
          </Button>

          {renderAlert()}
        </div>
      </form>
    );
  }
}

LoginForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  renderAlert: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(LoginForm);
