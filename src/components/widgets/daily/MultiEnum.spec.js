import React from "react";
import moment from "moment";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import IconButtonWithLabel from "../../common/IconButtonWithLabel";
import { testDate } from "../../../__mocks__/fixtures";
import MultiEnum from "./MultiEnum";

// TODO: move adapter to common test code
configure({ adapter: new Adapter() });

const middlewares = [];
const createMockStore = configureStore(middlewares);

describe("MultiEnum", () => {
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
        <MultiEnum
          isLoading={false}
          meter={meter}
          classes={{}}
          schema={{
            items: {
              type: "string",
              enum: ["foo", "bar", "baz"],
            },
          }}
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
    expect(wrapper.find(IconButtonWithLabel).length).toBe(3);
    expect(wrapper.find(IconButtonWithLabel)).toHaveLength(3);
    wrapper.unmount();
  });
});
