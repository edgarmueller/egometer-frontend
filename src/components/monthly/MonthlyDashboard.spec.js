import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "../../store/configureStore";
import mood from "../../widgets/day/mood";
import { moodEntries, moodMeter, moodSchema } from "../../__mocks__/fixtures";
import { MonthlyDashboard } from "./MonthlyDashboard";
import MonthlyMatrix from "./MonthlyMatrix";
import { rootEpic } from "../../epics";

configure({ adapter: new Adapter() });

describe("Monthly Dashboard", () => {
  it("should render monthly matrix component", () => {
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
        <MonthlyDashboard
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
              month: 2,
            },
          }}
          fetchEntries={fetchEntriesSpy}
          findBySchemaId={jest.fn()}
        />
      </Provider>
    );
    const matrix = wrapper.find(MonthlyMatrix);
    const dashboard = wrapper.find(MonthlyDashboard);
    expect(matrix.length).toEqual(1);
    expect(fetchEntriesSpy).toHaveBeenCalledWith(2019, 2);
    expect(dashboard.state().mounted).toBe(true);
    wrapper.unmount();
  });
});
