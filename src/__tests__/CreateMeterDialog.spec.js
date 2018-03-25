import React from "react";
import { configure, mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { CreateMeterDialog } from "../components/meters/CreateMeterDialog";
import {
  counterSchema,
  moodMeter,
  moodMeterId,
  moodSchema
} from "../__mocks__/testData";
import { isString, isNumberOrInteger } from "../common/testers";
import mockStorage from "../__mocks__/mockStorage";
import { BASE_URL } from "../constants";
import { wrap } from "module";

configure({ adapter: new Adapter() });

const mock = new MockAdapter(axios);
global.localStorage = mockStorage();

describe("CreateMeterDialog", () => {
  const schemas = [moodSchema, counterSchema];
  const widgets = [
    {
      name: "Mood Widget",
      isApplicable: s => (isString(s) ? 1 : -1)
    },
    {
      name: "Counter Widget",
      isApplicable: s => (isNumberOrInteger(s) ? 2 : -1)
    },
    {
      name: "Different Number Widget",
      isApplicable: s => (isNumberOrInteger(s) ? 1 : -1)
    }
  ];

  beforeEach(() => {
    mock.reset();
  });

  it("should render", () => {
    const wrapper = shallow(
      <CreateMeterDialog
        schemas={schemas}
        widgets={widgets}
        findBySchemaName={jest.fn()}
        onSubmit={jest.fn()}
      />
    );
    expect(wrapper.find(Select)).toHaveLength(2);
    expect(
      wrapper
        .find(Select)
        .at(0)
        .prop("value")
    ).toBe("mood");
    expect(
      wrapper
        .find(Select)
        .at(1)
        .prop("value")
    ).toBe("Mood Widget");
  });

  it("should support changing the name of the meter", () => {
    const wrapper = shallow(
      <CreateMeterDialog
        open={true}
        schemas={schemas}
        widgets={widgets}
        findBySchemaName={jest.fn()}
        onSubmit={jest.fn()}
      />
    );
    wrapper
      .find(TextField)
      .simulate("change", { target: { value: "Test meter" } });
    expect(wrapper.state().name).toBe("Test meter");
    expect(wrapper.state().error).toBeUndefined();
  });

  it("should support changing a schema", () => {
    let findBySchemaCalled = false;
    const wrapper = shallow(
      <CreateMeterDialog
        open={true}
        schemas={schemas}
        widgets={widgets}
        findBySchemaName={() => {
          findBySchemaCalled = true;
          return counterSchema;
        }}
        onSubmit={jest.fn()}
      />
    );
    wrapper
      .find(Select)
      .first()
      .simulate("change", { target: { value: "counter" } });
    expect(findBySchemaCalled).toBeTruthy();
  });

  it("should update widget combo if selected schema changes", () => {
    const wrapper = shallow(
      <CreateMeterDialog
        schemas={schemas}
        widgets={widgets}
        findBySchemaName={() => counterSchema}
        onSubmit={jest.fn()}
      />
    );
    wrapper
      .find(Select)
      .at(0)
      .simulate("change", { target: { value: "counter" } });
    expect(
      wrapper
        .find(Select)
        .at(1)
        .prop("value")
    ).toBe("Counter Widget");
  });

  it("should support changing widget", () => {
    const wrapper = shallow(
      <CreateMeterDialog
        schemas={schemas}
        widgets={widgets}
        findBySchemaName={jest.fn()}
        onSubmit={jest.fn()}
      />
    );
    expect(
      wrapper
        .find(Select)
        .at(1)
        .simulate("change", {
          target: { value: "Different Number Widget" }
        })
    );
    expect(wrapper.state().selectedWidget).toBe("Different Number Widget");
  });

  it("should support submitting a new meter", () => {
    let triggeredCreate = false;
    const promise = Promise.resolve({ ...moodMeter, id: moodMeterId });
    mock.onPost(`${BASE_URL}/meters`).reply(() => promise);
    promise.then(() => {
      triggeredCreate = true;
    });

    const wrapper = shallow(
      <CreateMeterDialog
        open={true}
        schemas={schemas}
        widgets={widgets}
        findBySchemaName={() => counterSchema}
        onSubmit={jest.fn()}
      />
    );
    wrapper.find(Button).simulate("click");
    promise.then(() => {
      expect(triggeredCreate).toBeTruthy();
    });
  });

  it("should be able to fail when submitting a new meter", () => {
    const promise = Promise.reject("Expected failure");
    mock.onPost(`${BASE_URL}/meters`).reply(() => promise);

    const wrapper = shallow(
      <CreateMeterDialog
        open={true}
        schemas={schemas}
        widgets={widgets}
        findBySchemaName={jest.fn()}
        onSubmit={jest.fn()}
      />
    );
    try {
      wrapper.find(Button).simulate("click");
    } catch (e) {
      expect(wrapper.state().error).toBe("Expected failure");
      expect(wrapper.find(TextField).props().error).toBe("Expected failure");
    }
  });

  it("should determine a selected schema when being mounted", () => {
    const wrapper = mount(
      <CreateMeterDialog
        schemas={schemas}
        widgets={widgets}
        findBySchemaName={jest.fn()}
        onSubmit={jest.fn()}
      />
    );
    expect(wrapper.state().selectedSchema.name).toBe("mood");
    wrapper.unmount();
  });
});
