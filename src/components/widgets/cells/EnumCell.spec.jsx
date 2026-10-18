import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import EnumCell from "./EnumCell";
import EnumCellRenderer from "./EnumCellRenderer";
import { MeterContext } from "../../../context";
import { moodMeterId, moodSchema, testDate } from "../../../__mocks__/fixtures";

configure({ adapter: new Adapter() });

describe("EnumCell", () => {
  const entry = { date: testDate, meterId: moodMeterId, value: "good" };
  const render = (updateEntry, deleteEntry) =>
    mount(
      <MeterContext.Provider value={{ updateEntry, deleteEntry }}>
        <EnumCell
          meterId={moodMeterId}
          data={entry}
          date={testDate}
          schema={moodSchema.schema}
          imageProvider={() => null}
          labelProvider={(value) => value}
        />
      </MeterContext.Provider>
    ).find(EnumCellRenderer);

  it("marks the stored value as selected", () => {
    const isSelected = render(vi.fn(), vi.fn()).prop("isSelected");
    expect(isSelected("good")).toBe(true);
    expect(isSelected("bad")).toBe(false);
  });

  it("updates to another value and clears the selected one", () => {
    const update = vi.fn();
    const updateEntry = vi.fn(() => update);
    const deleteEntry = vi.fn();
    const select = render(updateEntry, deleteEntry).prop("updateEntry");
    select("great");
    expect(updateEntry).toHaveBeenCalledWith(moodMeterId, testDate);
    expect(update).toHaveBeenCalledWith("great");
    select("good");
    expect(deleteEntry).toHaveBeenCalledWith(moodMeterId, entry);
  });
});
