import React, { Suspense, lazy, useEffect } from "react";
import PropTypes from "prop-types";
import { Redirect, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import AppShell from "./layout/AppShell";
import Loading from "./common/Loading";
import { useAuth } from "./auth/AuthProvider";
import requireAuth from "./auth/requireAuth";
import { fetchMeters } from "../actions";

const LoginPage = lazy(() => import("./auth/LoginPage"));
const DailyDashboard = lazy(() => import("./dashboards/DailyDashboard"));
const WeeklyDashboard = lazy(() => import("./dashboards/WeeklyDashboard"));
const MonthlyDashboard = lazy(() => import("./dashboards/MonthlyDashboard"));
const MeterList = lazy(() => import("./meters/MeterList"));
const InsightsPage = lazy(() => import("./insights/InsightsPage"));

// the pages of a logged in user, within the app's navigation
const AppPages = requireAuth(() => (
  <AppShell>
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path="/meters" component={MeterList} />
        <Route exact path="/insights" component={InsightsPage} />
        <Route
          exact
          path="/matrix/:year(\d{4})?/:month(0?[1-9]|1[012])?"
          component={MonthlyDashboard}
        />
        <Route
          exact
          path="/weekly/:year(\d{4})?/:week(0?[1-9]|[1-4][0-9]|5[0-3])?"
          component={WeeklyDashboard}
        />
        <Route
          exact
          path="/dashboard/:year(\d{4})?/:month(0?[1-9]|1[012])?/:day(0?[1-9]|[12][0-9]|3[01])?"
          component={DailyDashboard}
        />
        <Redirect to="/dashboard" />
      </Switch>
    </Suspense>
  </AppShell>
));

export const App = ({ fetchMeters }) => {
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      fetchMeters();
    }
  }, [isAuthenticated, fetchMeters]);

  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route component={AppPages} />
      </Switch>
    </Suspense>
  );
};

App.propTypes = {
  fetchMeters: PropTypes.func.isRequired,
};

export default connect(undefined, { fetchMeters })(App);
