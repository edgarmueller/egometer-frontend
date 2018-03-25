import React from "react";
import moment from "moment";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import Button from "@material-ui/core/Button";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import {
  moodMeterId,
  moodSchema,
  testDate
} from "../../../../__mocks__/testData";
import DailyEnum from "../../../../components/widgets/daily/Enum";
import IconButtonWithLabel from "../../../../components/common/IconButtonWithLabel";

configure({ adapter: new Adapter() });
const mockStore = configureStore([]);

describe("Mood meter", () => {
  it("should render submit entry form", () => {
    const store = mockStore();
    const wrapper = mount(
      <Provider store={store}>
        <DailyEnum
          schema={moodSchema.schema}
          meter={{ id: moodMeterId }}
          classes={{ mood: "" }}
          date={moment(testDate)}
          data={[
            {
              date: testDate,
              meterId: moodMeterId,
              value: "good"
            }
          ]}
        />
      </Provider>
    );
    expect(wrapper.find(IconButtonWithLabel).length).toBe(5);
    wrapper.unmount();
  });
});
