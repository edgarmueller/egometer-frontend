import React from "react";
import { configure, mount } from "enzyme";
import { Provider } from "react-redux";
import Adapter from "enzyme-adapter-react-16";
import { MonthlyDashboard } from "../components/monthly/MonthlyDashboard";
import { moodEntries, moodMeter, moodSchema, moodMeterId } from "../__mocks__/testData";
import mood from "../widgets/day/mood";
import configureStore from "../store/configureStore";
import MonthMatrix from "../components/monthly/MonthMatrix";

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
    const wrapper = mount(
      <Provider store={store}>
        <MonthlyDashboard
          isLoading={false}
          entries={{
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
          fetchEntries={jest.fn()}
          findBySchemaId={jest.fn()}
        />
      </Provider>
    );
    const matrix = wrapper.find(MonthMatrix);
    expect(matrix.length).toEqual(1);
    wrapper.unmount();
  });
});
