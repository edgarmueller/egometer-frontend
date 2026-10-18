import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { moodMeterId, moodSchema, testDate } from "../../../__mocks__/fixtures";
import DailyEnum from "./Enum";
import EnumRenderer from "./EnumRenderer";
import IconButtonWithLabel from "../../common/IconButtonWithLabel";
import MoodMeter from "../../../widgets/day/mood";

configure({ adapter: new Adapter() });
const mockStore = configureStore([]);

const goodEntry = { date: testDate, meterId: moodMeterId, value: "good" };

describe("Mood meter", () => {
  it("should render submit entry form", () => {
    const store = mockStore();
    const wrapper = mount(
      <Provider store={store}>
        <DailyEnum
          schema={moodSchema.schema}
          meter={{ id: moodMeterId }}
          classes={{ mood: "" }}
          date={testDate}
          data={[goodEntry]}
        />
      </Provider>
    );
    expect(wrapper.find(IconButtonWithLabel).length).toBe(5);
    wrapper.unmount();
  });

  it("should label the moods from awful to great", () => {
    const store = mockStore();
    const Mood = MoodMeter.day;
    const wrapper = mount(
      <Provider store={store}>
        <Mood
          schema={moodSchema.schema}
          meter={{ id: moodMeterId, name: "Mood" }}
          date={testDate}
          data={[]}
          updateEntry={jest.fn()}
        />
      </Provider>
    );
    expect(
      wrapper.find(IconButtonWithLabel).map((button) => button.prop("label"))
    ).toEqual(["Awful", "Bad", "Okay", "Good", "Great"]);
    wrapper.unmount();
  });

  it("should select a mood, and clear it when selected again", () => {
    const updateEntry = jest.fn();
    const deleteEntry = jest.fn();
    const wrapper = shallow(
      <DailyEnum
        schema={moodSchema.schema}
        meter={{ id: moodMeterId }}
        date={testDate}
        data={[goodEntry]}
        updateEntry={updateEntry}
        deleteEntry={deleteEntry}
      />
    );
    const select = wrapper.find(EnumRenderer).prop("updateEntry");
    select("great");
    expect(updateEntry).toHaveBeenCalledWith("great");
    select("good");
    expect(deleteEntry).toHaveBeenCalledWith(goodEntry);
    expect(updateEntry).toHaveBeenCalledTimes(1);
  });
});
