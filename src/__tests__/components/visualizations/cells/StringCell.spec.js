import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { StringCell } from "../../../../components/widgets/cells/StringCell";
import { moodMeterId, testDate } from "../../../../__mocks__/testData";

configure({ adapter: new Adapter() });

it("should open dialog for strings", () => {
  const schema = { type: "string" };
  const wrapper = mount(
    <StringCell
      classes={{ stringInput: "" }}
      schema={schema}
      meterId={moodMeterId}
      date={testDate}
      updateEntry={jest.fn()}
    />
  );
  // by default, string cells do not display any content,
  // but a dialog open on click
  wrapper
    .find("div")
    .first()
    .simulate("click");
  expect(wrapper.state().open).toBe(true);
  wrapper.unmount();
});
