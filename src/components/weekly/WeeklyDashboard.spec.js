import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "../../store/configureStore";
import { rootEpic } from "../../epics";
import mood from "../../widgets/day/mood";
import { moodEntries, moodMeter, moodSchema } from "../../__mocks__/fixtures";
import { WeeklyDashboard } from "./WeeklyDashboard";
import WeeklyMatrix from "./WeeklyMatrix";
import WeekPicker from "./WeekPicker";

configure({ adapter: new Adapter() });

describe("Weekly Dashboard", () => {
  it("should render weekly matrix component", () => {
    const { store, epicMiddleware } = configureStore({
      meters: {
        meters: [moodMeter],
      },
      entries: {
        entries: {
          [moodMeter.id]: moodEntries,
        },
        loadingStatus: {
          isLoading: false,
        },
      },
      schemas: {
        schemas: [moodSchema],
      },
    });
    epicMiddleware.run(rootEpic);
    const fetchEntriesSpy = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <WeeklyDashboard
          isLoading={false}
          schemas={[moodSchema]}
          entriesByMeter={{
            [moodMeter.id]: moodEntries,
          }}
          meters={[moodMeter]}
          classes={{
            monthMatrix: "",
          }}
          widgets={[mood]}
          match={{
            params: {
              year: 2019,
              week: 2,
            },
          }}
          fetchEntries={fetchEntriesSpy}
          findBySchemaId={jest.fn()}
        />
      </Provider>
    );
    const matrix = wrapper.find(WeeklyMatrix);
    expect(matrix.length).toEqual(1);
    expect(fetchEntriesSpy).toHaveBeenCalledWith(2019, 2);
    wrapper.unmount();
  });

  it("should update state when changing week", () => {
    const { store, epicMiddleware } = configureStore({
      meters: {
        meters: [moodMeter],
      },
      entries: {
        entries: {
          [moodMeter.id]: moodEntries,
        },
        loadingStatus: {
          isLoading: false,
        },
      },
      schemas: {
        schemas: [moodSchema],
      },
    });
    epicMiddleware.run(rootEpic);
    const fetchEntriesSpy = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <WeeklyDashboard
          isLoading={false}
          schemas={[moodSchema]}
          entriesByMeter={{
            [moodMeter.id]: moodEntries,
          }}
          meters={[moodMeter]}
          classes={{
            monthMatrix: "",
          }}
          widgets={[mood]}
          match={{
            params: {
              year: 2019,
              week: 2,
            },
          }}
          fetchEntries={fetchEntriesSpy}
          findBySchemaId={jest.fn()}
          history={{
            push: jest.fn(),
          }}
        />
      </Provider>
    );
    const weekPicker = wrapper.find(WeekPicker);
    fetchEntriesSpy.mockReset();
    weekPicker.props().onChange([new Date(Date.UTC(2019, 11, 24))]);
    const weeklyDashboard = wrapper.find(WeeklyDashboard);
    const { year, month, week } = weeklyDashboard.state();
    expect(year).toBe(2019);
    expect(month).toBe(12);
    expect(week).toBe(52);
    expect(fetchEntriesSpy).toHaveBeenCalledWith(2019, 52);
    wrapper.unmount();
  });
});
