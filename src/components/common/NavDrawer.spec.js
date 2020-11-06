import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { BrowserRouter as Router } from "react-router-dom";

import NavDrawer from "./NavDrawer";
import { ListItem } from "@material-ui/core";

configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

describe("NavDrawer", () => {
  it("should render logout button when logged in", () => {
    const store = mockStore({
      user: {
        isAuthenticated: true,
      },
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

  it("should render schemas link if user is admin", () => {
    const store = mockStore({
      user: {
        isAuthenticated: true,
        isAdmin: true,
      },
      schemas: {
        schemas: [],
      },
    });
    const wrapper = mount(
      <Router>
        <Provider store={store}>
          <NavDrawer
            navigateTo={jest.fn()}
            classes={{
              link: "",
            }}
            location={{
              pathname: "weekly",
            }}
          />
        </Provider>
      </Router>
    );
    expect(wrapper.find(ListItem).length).toBe(6);
  });
});
