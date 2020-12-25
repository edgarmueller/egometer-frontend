import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Button from "@material-ui/core/Button";
import { LoginPage } from "./LoginPage";

configure({ adapter: new Adapter() });

describe("LoginPage", () => {
  it("should render login button if not authenticated", () => {
    const wrapper = shallow(
      <LoginPage
        auth0={{
          isAuthenticated: false,
          isLoading: false,
        }}
        loginUser={jest.fn()}
        error={undefined}
        location={{
          search: "",
        }}
        classes={{
          button: "",
        }}
      />
    );
    expect(wrapper.find(Button).length).toBe(1);
  });

  it("should NOT render login button if authenticated", () => {
    const wrapper = shallow(
      <LoginPage
        auth0={{
          isAuthenticated: true,
          isLoading: false,
        }}
        loginUser={jest.fn()}
        error={undefined}
        location={{
          search: "",
        }}
      />
    );
    expect(wrapper.find(Button).length).toBe(0);
  });
});
