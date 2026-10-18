import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { useAuth } from "../auth/AuthProvider";
import { ListItem } from "@material-ui/core";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import NavDrawer from "./NavDrawer";

configure({ adapter: new Adapter() });
const mockStore = configureStore([]);
jest.mock("../auth/AuthProvider");

describe("NavDrawer", () => {
  it("should render logout button when logged in", () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      logout: jest.fn(),
    });
    const store = mockStore({
      schemas: {
        schemas: [],
      },
    });
    const wrapper = mount(
      <Router>
        <Provider store={store}>
          <NavDrawer
            navigateTo={jest.fn()}
            classes={{ link: "" }}
            location={{ pathname: "weekly" }}
          />
        </Provider>
      </Router>
    );
    expect(wrapper.find(ListItem).last().text()).toBe("Logout");
  });
});
