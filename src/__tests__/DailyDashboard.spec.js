import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { DailyDashboard } from "../components/daily/DailyDashboard";
import { moodEntries, moodMeter, moodMeterId } from "../__mocks__/testData";
import Widget from "../components/common/Widget";
import mood from "../widgets/day/mood";

configure({ adapter: new Adapter() });

const entries = {};
entries[moodMeterId] = moodEntries;

describe("Dashboard", () => {
  it("should render widget of a meter", () => {
    const wrapper = shallow(
      <DailyDashboard
        classes={{ display1: "test" }}
        meters={[moodMeter]}
        entries={entries}
        isLoading={false}
        widgets={[mood]}
        fetchEntries={jest.fn()}
      />
    );
    // Dashboard title
    expect(wrapper.find(Widget).length).toEqual(1);
  });
});
