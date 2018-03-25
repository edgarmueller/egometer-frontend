import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import "jest-localstorage-mock";
import GridLayout from "../components/common/GridLayout";

configure({ adapter: new Adapter() });

describe("GridLayout", () => {
  it("should generate a layout", () => {
    const wrapper = shallow(<GridLayout items={[{}, {}, {}]} />);
    expect(wrapper.state().layout).toHaveLength(3);
  });

  it("should show a Loading screen if no items have been given", () => {
    const wrapper = shallow(<GridLayout />);
    expect(wrapper.find("div").text()).toBe("No items defined here.");
  });
});
