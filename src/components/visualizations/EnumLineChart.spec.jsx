import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import { LineSeries, YAxis } from "react-vis";
import EnumLineChart from "./EnumLineChart";
import { moodSchema } from "../../__mocks__/fixtures";

configure({ adapter: new Adapter() });

describe("EnumLineChart", () => {
  const days = [1, 2, 3, 4].map((day) => new Date(2026, 9, day));
  const render = (data) =>
    shallow(
      <EnumLineChart
        data={data}
        days={days}
        schema={moodSchema.schema}
        labelProvider={(value) => value.toUpperCase()}
        meter={{ name: "Mood" }}
        width={500}
      />
    );

  it("plots better moods higher and leaves gaps for days without entry", () => {
    const wrapper = render([
      { date: "2026-10-01", value: "awful" },
      { date: "2026-10-02", value: "great" },
      { date: "2026-10-04", value: "okay" },
    ]);
    expect(
      wrapper
        .find(LineSeries)
        .prop("data")
        .map(({ y }) => y)
    ).toEqual([0, 4, null, 2]);
  });

  it("only uses entries of the shown days", () => {
    const wrapper = render([{ date: "2026-09-02", value: "great" }]);
    expect(
      wrapper
        .find(LineSeries)
        .prop("data")
        .map(({ y }) => y)
    ).toEqual([null, null, null, null]);
  });

  it("labels every mood on the y axis", () => {
    const yAxis = render([]).find(YAxis);
    expect(yAxis.prop("tickValues").map(yAxis.prop("tickFormat"))).toEqual([
      "AWFUL",
      "BAD",
      "OKAY",
      "GOOD",
      "GREAT",
    ]);
  });
});
