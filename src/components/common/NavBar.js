import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Ionicon from "react-ionicons";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { routerActions } from "react-router-redux";
import Radium from "radium";
import { link, logo } from "../../common/styles";
import { logout } from "../../actions";
import { visibleOnlyAdmin } from "../../common/auth";
import AddMeter from "./AddMeter";
import widgets from "../../widgets";
import { fetchMeters } from "../../actions";

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

export const NavBar = ({ classes, isAuthenticated, logout, fetchMeters }) => {
  const [open, setOpen] = useState(false);
  const handleClick = useCallback(() => setOpen(true));
  const handleClose = useCallback(() => setOpen(false));
  const confirmDialog = () => {
    handleClose();
    fetchMeters();
  };

  if (isAuthenticated) {
    return (
      <nav>
        <AppBar className={classes.appBar} position={"static"}>
          <Toolbar>
            <AdminLinkButton link="/schemas" label="Schemas" />
            <LinkButton link="/matrix" label="Month" />
            <LinkButton link="/weekly" label="Week" />
            <LinkButton link="/dashboard" label="Today" />
            <LinkButton link="/meters" label="Meters" />
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
            <Button onClick={handleClick}>Add meter</Button>
          </Toolbar>
        </AppBar>
        <Drawer open={open} onClose={handleClose}>
          <AddMeter
            open={open}
            onSubmit={confirmDialog}
            handleClose={handleClose}
            widgets={widgets}
          />
        </Drawer>
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
  },
  fetchMeters() {
    dispatch(fetchMeters());
  }
});

export default connect(
  s => ({
    isAuthenticated: s.user.isAuthenticated
  }),
  mapDispatchToProps
)(withStyles(styles)(NavBar));
