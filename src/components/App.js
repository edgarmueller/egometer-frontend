import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { connect } from "react-redux";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import "./App.css";
import Dashboard from "../components/daily/DailyDashboard";
import SchemaList from "../components/schemas/SchemaList";
import MonthDashboard from "../components/monthly/MonthDashboard";
import NavBar from "./common/NavBar";
import {
  userIsAuthenticated,
  userIsAdminRedir,
  userIsNotAuthenticated
} from "../common/auth";
import LoginPage from "./auth/LoginPage";
import ActivatedAccountPage from "./auth/ActivatedAccountPage";
import SignUpPage from "./auth/SignUpPage";
import RecoverPasswordPage from "./auth/RecoverPasswordPage";
import ResetPasswordPage from "./auth/ResetPasswordPage";

const ConnectedSwitch = connect(state => ({
  location: state.router.location
}))(Switch);

const mainStyle = {
  margin: "auto"
};

const navStyle = {
  maxWidth: "1200px",
  margin: "auto"
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <div style={navStyle}>
          <NavBar className={navStyle} />
        </div>
        <main style={mainStyle}>
          <ConnectedSwitch>
            <Route
              exact
              path="/login"
              component={userIsNotAuthenticated(LoginPage)}
            />
            <Route
              exact
              path="/sign-up"
              component={userIsNotAuthenticated(SignUpPage)}
            />
            <Route
              exact
              path="/schemas"
              component={userIsAuthenticated(userIsAdminRedir(SchemaList))}
            />
            <Route
              exact
              path="/matrix"
              component={userIsAuthenticated(MonthDashboard)}
            />
            <Route
              exact
              path="/dashboard"
              component={userIsAuthenticated(Dashboard)}
            />
            <Route exact path="/sign-in" component={LoginPage} />
            <Route
              exact
              path="/auth/account/activation/:token"
              component={ActivatedAccountPage}
            />
            <Route
              exact
              path="/auth/recover/password"
              component={RecoverPasswordPage}
            />
            <Route
              exact
              path="/auth/recover/password/:token"
              component={ResetPasswordPage}
            />
            <Route path="*" component={userIsAuthenticated(Dashboard)} />
          </ConnectedSwitch>
        </main>
      </div>
    );
  }
}

export default App;
