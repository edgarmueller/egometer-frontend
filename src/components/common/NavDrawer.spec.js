import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { useAuth0 } from "@auth0/auth0-react";
import { ListItem } from "@material-ui/core";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import NavDrawer from "./NavDrawer";

configure({ adapter: new Adapter() });
const mockStore = configureStore([]);
jest.mock("@auth0/auth0-react");

useAuth0.mockReturnValue({
  isAuthenticated: true,
  logout: jest.fn(),
  loginWithRedirect: jest.fn(),
});

describe("NavDrawer", () => {
  it("should render logout button when logged in", () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
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
