import React from "react";
import { configure, mount } from "enzyme";
import { Provider } from "react-redux";
import Adapter from "enzyme-adapter-react-16";
import MonthlyDashboard from "../components/monthly/MonthlyDashboard";
import { moodEntries, moodMeter, moodSchema } from "../__mocks__/testData";
import mood from "../widgets/day/mood";
import configureStore from "../store/configureStore";

configure({ adapter: new Adapter() });

describe("Dashboard", () => {
  it("should render widget of a meter", () => {
    const store = configureStore({
      meters: {
        meters: [moodMeter]
      },
      entries: {
        entries: [moodEntries],
        loadingStatus: {
          isLoading: false
        }
      },
      schemas: {
        schemas: [moodSchema]
      }
    });
    const wrapper = mount(
      <Provider store={store}>
        <MonthlyDashboard
          meters={[moodMeter]}
          classes={{
            monthMatrix: ""
          }}
          fetchEntries={jest.fn()}
          widgets={[mood]}
          match={{
            params: {
              year: 2019,
              month: 2
            }
          }}
        />
      </Provider>
    );
    const rows = wrapper.find(".ReactVirtualized__Table__row");
    // one row (class appears twice)
    expect(rows.length).toEqual(2);
    wrapper.unmount();
  });
});
