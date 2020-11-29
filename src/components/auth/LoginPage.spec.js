import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { LoginPage } from "./LoginPage";
import LoginForm from "./LoginForm";

configure({ adapter: new Adapter() });

describe("LoginPage", () => {
  it.skip("should render", () => {
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
    expect(wrapper.find(LoginForm).length).toBe(1);
  });
});
