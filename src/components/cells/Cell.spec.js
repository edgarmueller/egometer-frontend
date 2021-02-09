import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Cell from "./Cell";

configure({ adapter: new Adapter() });

describe("Cell", () => {
  it("should update if date changes", () => {
    const props = {
      date: "2021-02-01",
      color: "#000000",
      isLoading: false,
    };
    const comp = shallow(<Cell {...props} />);
    const shouldUpdate = comp
      .instance()
      .shouldComponentUpdate({ date: "2021-02-02" }, {});
    expect(shouldUpdate).toBe(true);
  });
  it("should NOT update if date does not change", () => {
    const props = {
      date: "2021-02-01",
      color: "#000000",
      isLoading: false,
    };
    const comp = shallow(<Cell {...props} />);
    const shouldUpdate = comp
      .instance()
      .shouldComponentUpdate({ date: "2021-02-01" }, {});
    expect(shouldUpdate).toBe(false);
  });
});
