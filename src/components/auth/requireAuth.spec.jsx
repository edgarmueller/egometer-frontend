import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import requireAuth from "./requireAuth";

vi.mock("./AuthProvider");

const Secret = () => <div>secret</div>;
const Protected = requireAuth(Secret);

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Route
        path="/login"
        render={({ location }) => <div>login{location.search}</div>}
      />
      <Route path="/weekly" component={Protected} />
    </MemoryRouter>
  );

describe("requireAuth", () => {
  it("should render the component if authenticated", () => {
    useAuth.mockReturnValue({ isAuthenticated: true });
    renderAt("/weekly");
    expect(screen.getByText("secret")).toBeInTheDocument();
  });

  it("should redirect to the login page if not authenticated", () => {
    useAuth.mockReturnValue({ isAuthenticated: false });
    renderAt("/weekly?x=1");
    expect(
      screen.getByText("login?redirect=%2Fweekly%3Fx%3D1")
    ).toBeInTheDocument();
  });
});
