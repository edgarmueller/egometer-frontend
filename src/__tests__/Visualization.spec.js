import React from "react";
import moment from "moment";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { counterSchema } from "../__mocks__/testData";

import { Widget } from "../components/common/Widget";

configure({ adapter: new Adapter() });

describe("Widget", () => {
  const FakeWidget = () => <span>Fake widget</span>;

  it("should render a given widget", () => {
    const counterMeter = {
      name: "counter",
      widget: "CounterWidget"
    };
    const widgets = [
      {
        name: "CounterWidget",
        month: FakeWidget
      }
    ];
    const wrapper = shallow(
      <Widget
        date={moment()}
        data={[]}
        meter={counterMeter}
        onSubmit={jest.fn()}
        width={"400"}
        height={"300"}
        updateEntry={jest.fn()}
        findBySchemaId={() => counterSchema}
        widgetType="month"
        widgets={widgets}
      />
    );
    expect(wrapper.find(FakeWidget).length).toBe(1);
  });
});
