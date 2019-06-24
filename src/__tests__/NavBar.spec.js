import React from "react";
import Media from "react-media";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { NavBar, LinkButton } from "../components/common/NavBar";

configure({ adapter: new Adapter() });

describe("NavBar", () => {
  it("should render two links when logged out", () => {
    const wrapper = shallow(
      <NavBar
        navigateTo={jest.fn()}
        classes={{
          link: ""
        }}
        location={{
          pathname: "weekly"
        }}
      />
    );
    // logo
    expect(wrapper.find(LinkButton).length).toBe(0);
  });

  it("should render logout button if user is authenticated", () => {
    const wrapper = shallow(
      <NavBar
        navigateTo={jest.fn()}
        isAuthenticated={true}
        classes={{
          link: ""
        }}
        location={{
          pathname: "weekly"
        }}
      />
    )
      .find(Media)
      .renderProp("children")();

    console.log(wrapper);

    expect(wrapper.find(LinkButton).length).toBe(4);
  });
});
