import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { connect } from "react-redux";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import "./App.css";
import NavBar from "./common/NavBar";
import {
  userIsAuthenticated,
  userIsAdminRedir,
  userIsNotAuthenticated
} from "../common/auth";
import asyncComponent from "../components/common/AsyncComponent";

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
const AsyncLoginPage = asyncComponent(() => import("./auth/LoginPage"));
const AsyncSignUpPage = asyncComponent(() => import("./auth/SignUpPage"));
const AsyncActivedAccountPage = asyncComponent(() =>
  import("./auth/ActivatedAccountPage")
);
const AsyncRecoverPasswordPage = asyncComponent(() =>
  import("./auth/RecoverPasswordPage")
);
const AsyncResetPasswordPage = asyncComponent(() =>
  import("./auth/ResetPasswordPage")
);
const AsyncDailyDashboard = asyncComponent(() =>
  import("../components/daily/DailyDashboard")
);
const AsyncSchemaList = asyncComponent(() =>
  import("../components/schemas/SchemaList")
);
const AsycnMonthDashboard = asyncComponent(() =>
  import("../components/monthly/MonthDashboard")
);

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
              component={userIsNotAuthenticated(AsyncLoginPage)}
            />
            <Route
              exact
              path="/sign-up"
              component={userIsNotAuthenticated(AsyncSignUpPage)}
            />
            <Route
              exact
              path="/schemas"
              component={userIsAuthenticated(userIsAdminRedir(AsyncSchemaList))}
            />
            <Route
              exact
              path="/matrix"
              component={userIsAuthenticated(AsycnMonthDashboard)}
            />
            <Route
              exact
              path="/dashboard"
              component={userIsAuthenticated(AsyncDailyDashboard)}
            />
            <Route
              exact
              path="/auth/account/activation/:token"
              component={AsyncActivedAccountPage}
            />
            <Route
              exact
              path="/auth/recover/password"
              component={AsyncRecoverPasswordPage}
            />
            <Route
              exact
              path="/auth/recover/password/:token"
              component={AsyncResetPasswordPage}
            />
            <Route
              path="*"
              component={userIsAuthenticated(AsyncDailyDashboard)}
            />
          </ConnectedSwitch>
        </main>
      </div>
    );
  }
}

export default App;
