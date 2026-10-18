import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import { renderWithProviders } from "../../test-utils";

const createAuth = (overrides = {}) => ({
  isAuthenticated: false,
  login: vi.fn(() => Promise.resolve()),
  signUp: vi.fn(() => Promise.resolve()),
  ...overrides,
});

// renders the page at /login, showing where it redirects to
const renderPage = (auth, search = "") =>
  renderWithProviders(
    <>
      <Route
        exact
        path="/login"
        render={({ location }) => <LoginPage auth={auth} location={location} />}
      />
      <Route
        path="/:page"
        render={({ location }) =>
          location.pathname === "/login" ? null : (
            <div>at {location.pathname}</div>
          )
        }
      />
    </>,
    { path: `/login${search}` }
  );

const fillAndSubmit = async (email, password) => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/Email/), email);
  await user.type(screen.getByLabelText(/Password/), password);
  // the submit button, not the link switching between logging in and up
  const [submit] = screen
    .getAllByRole("button")
    .filter((button) => button.type === "submit");
  await user.click(submit);
};

describe("LoginPage", () => {
  it("should render the login form if not authenticated", () => {
    renderPage(createAuth());
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
  });

  it("should redirect to the meters if authenticated", () => {
    renderPage(createAuth({ isAuthenticated: true }));
    expect(screen.getByText("at /meters")).toBeInTheDocument();
  });

  it("should redirect back to the requested page after login", () => {
    renderPage(
      createAuth({ isAuthenticated: true }),
      "?redirect=%2Fweekly%2F2021"
    );
    expect(screen.getByText("at /weekly/2021")).toBeInTheDocument();
  });

  it("should ignore external redirects", () => {
    renderPage(
      createAuth({ isAuthenticated: true }),
      "?redirect=%2F%2Fevil.example.com"
    );
    expect(screen.getByText("at /meters")).toBeInTheDocument();
  });

  it("should log in with the entered credentials", async () => {
    const auth = createAuth();
    renderPage(auth);
    await fillAndSubmit("foo@example.com", "secret123");
    expect(auth.login).toHaveBeenCalledWith("foo@example.com", "secret123");
    expect(auth.signUp).not.toHaveBeenCalled();
  });

  it("should sign up after switching modes", async () => {
    const auth = createAuth();
    renderPage(auth);
    await userEvent.click(screen.getByRole("button", { name: "Sign up" }));
    expect(screen.getByText("Create your account")).toBeInTheDocument();
    await fillAndSubmit("foo@example.com", "secret123");
    expect(auth.signUp).toHaveBeenCalledWith("foo@example.com", "secret123");
  });

  it("should show an error on invalid credentials", async () => {
    const auth = createAuth({
      login: vi.fn(() => Promise.reject({ response: { status: 401 } })),
    });
    renderPage(auth);
    await fillAndSubmit("foo@example.com", "wrong");
    expect(
      await screen.findByText("Invalid email or password.")
    ).toBeInTheDocument();
  });
});
