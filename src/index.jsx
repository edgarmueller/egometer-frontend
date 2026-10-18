import React from "react";
import { createRoot } from "react-dom/client";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "@fontsource-variable/inter";
import theme from "./theme";
import App from "./components/App";
import { configureStore, history } from "./store/configureStore";
import DefaultErrorBoundary from "./components/common/DefaultErrorBoundary";
import { AuthProvider } from "./components/auth/AuthProvider";
import { rootEpic } from "./epics";

const { store, epicMiddleware } = configureStore();
epicMiddleware.run(rootEpic);

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <AuthProvider>
        <Provider store={store}>
          <Router history={history}>
            <DefaultErrorBoundary>
              <App />
            </DefaultErrorBoundary>
          </Router>
        </Provider>
      </AuthProvider>
    </LocalizationProvider>
  </ThemeProvider>
);
