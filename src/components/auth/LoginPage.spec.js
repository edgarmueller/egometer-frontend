/* eslint-disable no-undef */
import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Redirect } from "react-router";
import { LoginPage } from "./LoginPage";

configure({ adapter: new Adapter() });

const createAuth = (overrides = {}) => ({
  isAuthenticated: false,
  login: jest.fn(() => Promise.resolve()),
  signUp: jest.fn(() => Promise.resolve()),
  ...overrides,
});

const render = (auth, search = "") =>
  shallow(<LoginPage auth={auth} location={{ search }} classes={{}} />);

const fillAndSubmit = async (wrapper, email, password) => {
  const [emailField, passwordField] = wrapper.find(TextField);
  emailField.props.onChange({ target: { value: email } });
  passwordField.props.onChange({ target: { value: password } });
  await wrapper.find("form").props().onSubmit({ preventDefault: jest.fn() });
};

describe("LoginPage", () => {
  it("should render the login form if not authenticated", () => {
    const wrapper = render(createAuth());
    expect(wrapper.find(TextField).length).toBe(2);
    expect(wrapper.find(Button).first().text()).toBe("Login");
  });

  it("should redirect to the meters if authenticated", () => {
    const wrapper = render(createAuth({ isAuthenticated: true }));
    expect(wrapper.find(Redirect).prop("to")).toBe("/meters");
  });

  it("should redirect back to the requested page after login", () => {
    const wrapper = render(
      createAuth({ isAuthenticated: true }),
      "?redirect=%2Fweekly%2F2021"
    );
    expect(wrapper.find(Redirect).prop("to")).toBe("/weekly/2021");
  });

  it("should ignore external redirects", () => {
    const wrapper = render(
      createAuth({ isAuthenticated: true }),
      "?redirect=%2F%2Fevil.example.com"
    );
    expect(wrapper.find(Redirect).prop("to")).toBe("/meters");
  });

  it("should log in with the entered credentials", async () => {
    const auth = createAuth();
    const wrapper = render(auth);
    await fillAndSubmit(wrapper, "foo@example.com", "secret123");
    expect(auth.login).toHaveBeenCalledWith("foo@example.com", "secret123");
    expect(auth.signUp).not.toHaveBeenCalled();
  });

  it("should sign up after switching modes", async () => {
    const auth = createAuth();
    const wrapper = render(auth);
    wrapper.find(Button).last().simulate("click");
    expect(wrapper.find(Button).first().text()).toBe("Sign up");
    await fillAndSubmit(wrapper, "foo@example.com", "secret123");
    expect(auth.signUp).toHaveBeenCalledWith("foo@example.com", "secret123");
  });

  it("should show an error on invalid credentials", async () => {
    const auth = createAuth({
      login: jest.fn(() => Promise.reject({ response: { status: 401 } })),
    });
    const wrapper = render(auth);
    await fillAndSubmit(wrapper, "foo@example.com", "wrong");
    expect(wrapper.text()).toContain("Invalid email or password.");
  });
});
