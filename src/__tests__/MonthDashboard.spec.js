import React from "react";
import { findDOMNode } from "react-dom";
import { configure, mount } from "enzyme";
import { Provider } from "react-redux";
import Adapter from "enzyme-adapter-react-16";
import MonthDashboard from "../components/monthly/MonthDashboard";
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
        <MonthDashboard
          meters={[moodMeter]}
          classes={{
            monthMatrix: ""
          }}
          widgets={[mood]}
        />
      </Provider>
    );
    const rows = wrapper.find(".ReactVirtualized__Table__row");
    // one row (class appears twice)
    expect(rows.length).toEqual(2);
    wrapper.unmount();
  });
});
