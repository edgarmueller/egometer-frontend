import React from "react";
import { Link } from "react-router-dom";
import Ionicon from "react-ionicons";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { routerActions } from "react-router-redux";
import Radium from "radium";
import { link, logo } from "../../common/styles";
import { logout } from "../../actions";
import { visibleOnlyAdmin } from "../../common/auth";

const styles = () => ({
  appBar: {
    backgroundColor: "#fff",
    boxShadow: "none",
    borderBottom: "1px solid #ebebeb",
    flexDirection: "row",
    justifyContent: "center"
  },
  link: {
    ...link,
    flex: 1
  },
  logo
});

export const RadiumLink = Radium(Link);
export const LinkButton = withStyles(styles)(({ classes, link, label }) => (
  <Button className={classes.link} component={RadiumLink} to={link}>
    {label}
  </Button>
));
const AdminLinkButton = visibleOnlyAdmin(props => <LinkButton {...props} />);
const isDevmode = process.env.NODE_ENV === "development";

export const NavBar = ({ classes, isAuthenticated, logout }) => {
  if (isAuthenticated) {
    return (
      <nav>
        <AppBar className={classes.appBar} position={"static"}>
          <Toolbar>
            <AdminLinkButton link="/schemas" label="Schemas" />
            <LinkButton link="/matrix" label="Month" />
            <LinkButton link="/weekly" label="Week" />
            <LinkButton link="/dashboard" label="Today" />
            <Button className={classes.link} onClick={logout}>
              Logout
            </Button>
            <RadiumLink className={classes.logo} to="/">
              <Ionicon icon="md-flash" />
              egometer
              {isDevmode && (
                <strong style={{ color: "#FF7043" }}>&nbsp;DEVMODE</strong>
              )}
            </RadiumLink>
          </Toolbar>
        </AppBar>
      </nav>
    );
  }

  return (
    <nav>
      <AppBar className={classes.appBar} position={"static"}>
        <Toolbar>
          <RadiumLink className={classes.logo} to="/">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <Ionicon icon="md-flash" />
              egometer
            </div>
          </RadiumLink>
        </Toolbar>
      </AppBar>
    </nav>
  );
};

NavBar.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    link: PropTypes.string.isRequired
  }).isRequired
};

NavBar.defaultProps = {
  user: undefined
};

const mapDispatchToProps = dispatch => ({
  navigateTo(destination) {
    dispatch(routerActions.push(destination));
  },
  logout() {
    dispatch(logout());
  }
});

export default connect(
  s => ({
    isAuthenticated: s.user.isAuthenticated
  }),
  mapDispatchToProps
)(withStyles(styles)(NavBar));
