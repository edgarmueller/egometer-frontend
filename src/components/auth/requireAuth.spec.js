import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { MemoryRouter, Route } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import requireAuth from "./requireAuth";

configure({ adapter: new Adapter() });
jest.mock("./AuthProvider");

const Secret = () => <div>secret</div>;
const Protected = requireAuth(Secret);

const renderAt = (path) =>
  mount(
    <MemoryRouter initialEntries={[path]}>
      <div>
        <Route
          path="/login"
          render={({ location }) => <div>login{location.search}</div>}
        />
        <Route path="/weekly" component={Protected} />
      </div>
    </MemoryRouter>
  );

describe("requireAuth", () => {
  it("should render the component if authenticated", () => {
    useAuth.mockReturnValue({ isAuthenticated: true });
    expect(renderAt("/weekly").text()).toBe("secret");
  });

  it("should redirect to the login page if not authenticated", () => {
    useAuth.mockReturnValue({ isAuthenticated: false });
    expect(renderAt("/weekly?x=1").text()).toBe(
      "login?redirect=%2Fweekly%3Fx%3D1"
    );
  });
});
