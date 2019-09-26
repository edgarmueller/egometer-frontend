import React, { Fragment } from "react";
import Radium from "radium";
import { Link } from "react-router-dom";
import { Hidden, IconButton, withStyles } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Ionicon from "react-ionicons";
import NavDrawer from "./NavDrawer";
import { logo } from "../../common/styles";

const RadiumLink = Radium(Link);

const styles = {
  logo
};

const Logo = withStyles(styles)(({ classes }) => (
  <RadiumLink
    className={classes.logo}
    to="/"
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      fontSize: "1.5rem"
    }}
  >
    <Ionicon icon="md-flash" />
    egometer
  </RadiumLink>
));

const WithLayout = WrappedComponent => {
  return class extends React.Component {
    state = {
      isNavOpen: false
    };

    openNav = () => {
      console.log("opening");
      this.setState({ isNavOpen: true });
    };

    closeNav = () => {
      this.setState({ isNavOpen: false });
    };

    render() {
      return (
        <Fragment>
          <Hidden lgUp>
            <div style={{ display: "flex" }}>
              <IconButton onClick={this.openNav}>
                <MenuIcon />
              </IconButton>
              <Logo />
            </div>
          </Hidden>
          <div style={{ display: "flex" }}>
            <NavDrawer
              isNavOpen={this.state.isNavOpen}
              closeNav={this.closeNav}
            />
            <main style={{ flexGrow: 1 }}>
              <WrappedComponent {...this.props} />
            </main>
          </div>
        </Fragment>
      );
    }
  };
};
export default WithLayout;
