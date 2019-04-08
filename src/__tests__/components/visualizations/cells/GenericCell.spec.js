import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Checkbox from "@material-ui/core/Checkbox";
import { GenericCell } from "../../../../components/widgets/cells/GenericCell";
import {
  counterMeterId,
  moodMeterId,
  testDate
} from "../../../../__mocks__/testData";

configure({ adapter: new Adapter() });

// test for background color set in case of present data (hover, focused)

describe("Generic Cell", () => {
  it("should render booleans", () => {
    const schema = { type: "boolean" };
    const wrapper = mount(
      <GenericCell
        classes={{ stringInput: "" }}
        schema={schema}
        meterId={counterMeterId}
        date={testDate}
        updateEntry={jest.fn()}
      />
    );
    expect(wrapper.find(Checkbox).length).toBe(1);
    wrapper.unmount();
  });

  it("should render numbers", () => {
    const schema = { type: "number" };
    const wrapper = mount(
      <GenericCell
        classes={{ stringInput: "" }}
        schema={schema}
        meterId={counterMeterId}
        date={testDate}
        updateEntry={jest.fn()}
      />
    );
    expect(wrapper.find("input").prop("type")).toBe("number");
    wrapper.unmount();
  });

  it("it should call handleOnKeyDown when pressing a key", () => {
    let didUpdate = false;
    const schema = { type: "number" };
    const wrapper = mount(
      <GenericCell
        classes={{ stringInput: "" }}
        schema={schema}
        meterId={counterMeterId}
        date={testDate}
        updateEntry={() => (didUpdate = true)}
      />
    );
    wrapper
      .find("input")
      .simulate('focus')
      .simulate("keydown", { key: "Enter", target: { value: "42" } })
      .simulate('blur')
    expect(didUpdate).toBe(true);
    wrapper.unmount();
  });

  it("should render strings", () => {
    const schema = { type: "string" };
    const wrapper = mount(
      <GenericCell
        classes={{ stringInput: "" }}
        schema={schema}
        meterId={moodMeterId}
        date={testDate}
        updateEntry={jest.fn()}
      />
    );
    // by default, string cells do not display any content,
    // but a dialog open on click
    // wrapper.find('div').first().simulate('click');
    expect(wrapper.find(Dialog).length).toBe(1);
    wrapper.unmount();
  });

  it("should close string dialog if close button is pressed", () => {
    const schema = { type: "string" };
    const wrapper = mount(
      <GenericCell
        classes={{ stringInput: "" }}
        schema={schema}
        meterId={moodMeterId}
        date={testDate}
        updateEntry={jest.fn()}
      />
    );
    // open dialog
    wrapper
      .find("div")
      .first()
      .simulate("click");
    wrapper
      .find(Button)
      .at(1)
      .simulate("click");
    wrapper.unmount();
  });
});
