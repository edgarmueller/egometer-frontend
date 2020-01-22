import React from "react";
import { configure, mount } from "enzyme";
import { Provider } from "react-redux";
import Adapter from "enzyme-adapter-react-16";
import { MonthlyDashboard } from "./MonthlyDashboard";
import { moodEntries, moodMeter, moodSchema } from "../../__mocks__/fixtures";
import mood from "../../widgets/day/mood";
import configureStore from "../../store/configureStore";
import MonthMatrix from "./MonthMatrix";

configure({ adapter: new Adapter() });

describe("Monthly Dashboard", () => {
  it("should render monthly matrix component", () => {
    const store = configureStore({
      meters: {
        meters: [moodMeter]
      },
      entries: {
        entries: {
          [moodMeter.id]: moodEntries
        },
        loadingStatus: {
          isLoading: false
        }
      },
      schemas: {
        schemas: [moodSchema]
      }
    });
    const fetchEntriesSpy = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MonthlyDashboard
          isLoading={false}
          schemas={[moodSchema]}
          entriesByMeter={{
            [moodMeter.id]: moodEntries
          }}
          meters={[moodMeter]}
          classes={{
            monthMatrix: ""
          }}
          widgets={[mood]}
          match={{
            params: {
              year: 2019,
              month: 2
            }
          }}
          fetchEntries={fetchEntriesSpy}
          findBySchemaId={jest.fn()}
        />
      </Provider>
    );
    const matrix = wrapper.find(MonthMatrix);
    const dashboard = wrapper.find(MonthlyDashboard);
    expect(matrix.length).toEqual(1);
    expect(fetchEntriesSpy).toHaveBeenCalledWith(2019, 2);
    expect(dashboard.state().mounted).toBe(true);
    wrapper.unmount();
  });
});
