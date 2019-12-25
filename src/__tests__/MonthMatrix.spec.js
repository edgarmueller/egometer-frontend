import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { moodEntries, moodMeter, moodSchema } from "../__mocks__/fixtures";
import { Table } from "react-virtualized";
import { MatrixContainer } from "../containers/MatrixContainer";
import MonthMatrix from "../components/monthly/MonthMatrix";
import widgets from "../widgets";
import { daysOfMonth } from "../common/date";
configure({ adapter: new Adapter() });

const entries = [moodEntries];

describe("MonthMatrix", () => {
  it("should render", () => {
    const wrapper = mount(
      <MatrixContainer
        child={MonthMatrix}
        entries={{
          [moodMeter.id]: moodEntries
        }}
        meters={[moodMeter]}
        findBySchemaId={() => moodSchema.schema}
        year={2018}
        month={4}
        width={800}
        widgets={widgets}
        updateEntry={() => jest.fn()}
        days={daysOfMonth(2018, 4)}
      />
    );
    expect(wrapper.find(Table).length).toBe(1);
    // meter name column + 30 days of april
    expect(wrapper.find(".ReactVirtualized__Table__headerColumn").length).toBe(
      31
    );
    wrapper.unmount();
  });

  it("should render a row for each meter", () => {
    const wrapper = mount(
      <MonthMatrix
        entries={{
          [moodMeter.id]: moodEntries
        }}
        meters={[moodMeter]}
        year={2018}
        month={4}
        width={800}
        days={daysOfMonth(2018, 4)}
        findBySchemaId={() => moodSchema.schema}
        updateEntry={() => jest.fn()}
        widgets={widgets}
      />
    );
    expect(wrapper.find(".ReactVirtualized__Table__headerRow").length).toBe(1);
    expect(wrapper.find(".ReactVirtualized__Table__row").length).toBe(2);
    wrapper.unmount();
  });
});
