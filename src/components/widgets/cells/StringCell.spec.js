import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { StringCell } from "./StringCell";
import { moodMeterId, testDate } from "../../../__mocks__/fixtures";
import { Dialog } from "@material-ui/core";

configure({ adapter: new Adapter() });

let setState;
let wrapper;

beforeEach(() => {
  setState = jest.fn();
  const useStateSpy = jest.spyOn(React, "useState");
  useStateSpy.mockImplementation(init => [init, setState]);
});

afterEach(() => {
  wrapper.unmount();
});

it("should open dialog for strings", () => {
  const schema = { type: "string" };
  wrapper = mount(
    <StringCell
      classes={{ stringInput: "" }}
      schema={schema}
      meterId={moodMeterId}
      date={testDate}
      updateEntry={jest.fn()}
      isLoading={false}
    />
  );
  // by default, string cells do not display any content,
  // but a dialog open on click
  wrapper
    .find("div")
    .first()
    .simulate("click");
  const isDialogOpen = wrapper.find(Dialog).props().open;
  expect(isDialogOpen).toBe(true);
});
