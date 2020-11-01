import React from "react";
import _ from "lodash";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import withStyles from "@material-ui/core/styles/withStyles";
import red from "@material-ui/core/colors/red";
import PropTypes from "prop-types";
import LinkButton from "../../components/LinkButton";

const styles = {
  signUpButton: {
    textDecoration: "none",
    color: "#333435",
    paddingLeft: "1em",
    paddingRight: "1em",
    display: "inline-flex",
    marginLeft: "1em",
    marginRight: "1em",
    height: "36px",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#80CBC4",
      color: "#fff",
    },
    alignItems: "center",
    textTransform: "uppercase",
    fontSize: "0.8em",
    letterSpacing: "0.065em",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 280,
    margin: "0 auto",
  },
};

export class SignUpForm extends React.Component {
  render() {
    const {
      classes,
      handleSubmit,
      handleUpdateName,
      handleUpdateEmail,
      handleUpdatePassword,
      handleUpdateConfirmationPassword,
      errors,
      name,
      mail,
    } = this.props;

    return (
      <div>
        <div className={classes.form}>
          <FormControl required error={!_.isEmpty(errors.name)}>
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input
              id="name"
              onChange={handleUpdateName}
              placeholder="Enter your name"
              defaultValue={name}
            />
            <FormHelperText id="error-name">{errors.name}</FormHelperText>
          </FormControl>
          <FormControl required error={!_.isEmpty(errors.mail)}>
            <InputLabel htmlFor="mail">Mail</InputLabel>
            <Input
              id="mail"
              onChange={handleUpdateEmail}
              placeholder="Enter your mail address"
              defaultValue={mail}
            />
            <FormHelperText id="error-mail">{errors.mail}</FormHelperText>
          </FormControl>
          <FormControl required error={!_.isEmpty(errors.password)}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              onChange={handleUpdatePassword}
              type="password"
            />
            <FormHelperText id="error-passowrd">
              {errors.password}
            </FormHelperText>
          </FormControl>
          <FormControl required error={!_.isEmpty(errors.confirmationPassword)}>
            <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
            <Input
              id="confirm-password"
              onChange={handleUpdateConfirmationPassword}
              type="password"
            />
            <FormHelperText id="error-confirm-passowrd">
              {errors.confirmationPassword}
            </FormHelperText>
          </FormControl>
        </div>

        <div style={{ marginTop: "1em" }}>
          <LinkButton to="/" label="Back to front page" />
          <LinkButton
            to="/auth/recover/password"
            label="I already have an account"
          />
          <Button className={classes.signUpButton} onClick={handleSubmit}>
            Sign Up
          </Button>
        </div>
        <div style={{ color: red[500] }}>{errors.message}</div>
      </div>
    );
  }
}

SignUpForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUpdateName: PropTypes.func.isRequired,
  handleUpdateEmail: PropTypes.func.isRequired,
  handleUpdatePassword: PropTypes.func.isRequired,
  handleUpdateConfirmationPassword: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({
    message: PropTypes.string,
    name: PropTypes.string,
    mail: PropTypes.string,
    password: PropTypes.string,
    confirmationPassword: PropTypes.string,
  }),
  name: PropTypes.string,
  mail: PropTypes.string,
};

SignUpForm.defaultProps = {
  errors: {
    message: null,
    mail: null,
    password: null,
    name: null,
  },
  name: "",
  mail: "",
};

export default withStyles(styles)(SignUpForm);
