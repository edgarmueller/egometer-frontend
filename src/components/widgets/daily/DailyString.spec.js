import React from "react";
import moment from "moment";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import { TextField } from "@material-ui/core";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { DailyString } from "./String";
import { testDate } from "../../../__mocks__/fixtures";

// TODO: move adapter to common test code
configure({ adapter: new Adapter() });

const middlewares = [];
const createMockStore = configureStore(middlewares);

describe("Journal", () => {
  it("should render textarea", () => {
    const store = createMockStore();
    const journalMeterId = "5ac23b3f8fdd856d4c3611a1";
    const unused = undefined;
    const journalMeter = {
      id: journalMeterId,
      name: unused,
      widget: unused,
      schemaId: unused,
      color: unused
    };
    const wrapper = mount(
      <Provider store={store}>
        <DailyString
          isLoading={false}
          meter={journalMeter}
          classes={{
            divStyle: {}
          }}
          date={moment(testDate).format("YYYY-MM-DD")}
          data={[
            {
              date: testDate,
              meterId: journalMeterId,
              value: "test text is tasty"
            }
          ]}
          width={600}
          height={400}
          updateEntry={jest.fn()}
        />
      </Provider>
    );
    expect(wrapper.find(TextField).length).toBe(1);
    wrapper.unmount();
  });
});
