import React from "react";
import { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { counterSchema } from "../__mocks__/testData";

import { Widget } from "../components/common/Widget";
import NoWidgetFound from "../components/common/NoWidgetFound";

configure({ adapter: new Adapter() });

describe("Widget", () => {
  const FakeWidget = () => <span>Fake widget</span>;

  it("should render a given widget", () => {
    const counterMeter = {
      name: "counter",
      widget: "CounterWidget"
    };
    const widgets = [{
      name: "CounterWidget",
      day: FakeWidget
    }];
    const wrapper = mount(
      <Widget
        date="2019-03-30"
        data={[]}
        meter={counterMeter}
        updateEntry={jest.fn()}
        widgetType="day"
        widgets={widgets}
        schema={counterSchema}
      />
    );
    expect(wrapper.find(FakeWidget).length).toBe(1);
    wrapper.unmount()
  });
});
