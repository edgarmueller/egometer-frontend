import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { ColorPicker } from "./ColorPicker";

configure({ adapter: new Adapter() });

describe("ColorPicker", () => {
  it("should be displayed when clicked", () => {
    const wrapper = shallow(<ColorPicker />);
    wrapper.find("div").first().simulate("click");
    expect(wrapper.state().open).toBe(true);
  });
});
