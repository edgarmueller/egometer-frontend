import React from "react";
import PropTypes from "prop-types";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import theme from "./theme";

export const mockStore = configureMockStore([]);

export const storeState = ({ meters = [], entries = {}, ...rest } = {}) => ({
  meters: { meters, isLoading: false, error: undefined },
  entries: {
    entries,
    error: undefined,
    loadingStatus: { isLoading: false },
  },
  ...rest,
});

/**
 * Renders the UI within the app's providers, with a mock store of the given
 * state and a router at the given path.
 */
export const renderWithProviders = (
  ui,
  { state = storeState(), store = mockStore(state), path = "/" } = {}
) => {
  const Wrapper = ({ children }) => (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Provider store={store}>
          <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>
        </Provider>
      </LocalizationProvider>
    </ThemeProvider>
  );
  Wrapper.propTypes = { children: PropTypes.node };
  return { store, ...render(ui, { wrapper: Wrapper }) };
};
