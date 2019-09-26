import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { App } from "../components/App";

configure({ adapter: new Adapter() });

it("fetches meters and schemas on mount", () => {
  const wrapper = shallow(<App classes={{ logo: "" }} />);
  expect(wrapper.find("div").length).toBe(1);
});
