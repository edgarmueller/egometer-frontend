import React from "react";
import moment from "moment";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import Switch from "@material-ui/core/Switch";
import { testDate } from "../../../__mocks__/fixtures";
import ConnectedComponent from "../../common/ConnectedComponent";
import Boolean from "./Boolean";

// TODO: move adapter to common test code
configure({ adapter: new Adapter() });

const middlewares = [];
const createMockStore = configureStore(middlewares);

describe("Boolean", () => {
  it("should render", () => {
    const store = createMockStore();
    const meterId = "5ac23b3f8fdd856d4c3611a1";
    const unused = undefined;
    const meter = {
      id: meterId,
      name: unused,
      widget: unused,
      schemaId: unused,
      color: unused,
    };
    const wrapper = mount(
      <Provider store={store}>
        <Boolean
          isLoading={false}
          meter={meter}
          classes={{}}
          date={moment(testDate).format("YYYY-MM-DD")}
          data={[
            {
              date: testDate,
              meterId,
              value: true,
            },
          ]}
          width={600}
          height={400}
          updateEntry={jest.fn()}
        />
      </Provider>
    );
    expect(wrapper.find(ConnectedComponent).length).toBe(1);
    expect(wrapper.find(Switch).length).toBe(1);
    wrapper.unmount();
  });
});
