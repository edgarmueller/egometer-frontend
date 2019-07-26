import React, { useContext } from "react";
import { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ConnectedComponent from "../components/common/ConnectedComponent";
import { testDate } from "../__mocks__/testData";
import { MeterContext } from "../context";

configure({ adapter: new Adapter() });

describe("ConnectedComponent", () => {
  let setState;
  let wrapper;

  beforeEach(() => {
    setState = jest.fn();
    const useStateSpy = jest.spyOn(React, "useState");
    useStateSpy.mockImplementation(init => [init, setState]);
  });

  afterEach(() => {
    jest.clearAllMocks();
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it("should render its children", () => {
    wrapper = shallow(
      <ConnectedComponent
        date={testDate}
        updateEntry={jest.fn()}
        isLoading={false}
      >
        {() => <div>Test</div>}
      </ConnectedComponent>
    );
    expect(wrapper.find("div").length).toBe(1);
  });

  it("should provide data to its children", () => {
    let provided = undefined;
    const wrapper = shallow(
      <ConnectedComponent
        data={{ value: "init" }}
        date={testDate}
        updateEntry={jest.fn()}
        isLoading={false}
      >
        {({ data }) => {
          provided = data;
        }}
      </ConnectedComponent>
    );
    wrapper.setProps({ data: { value: "foo" } });
    expect(provided).toBe("foo");
  });

  it("should update its stored data on key down", () => {
    let keydownHandler;
    let providedData;
    shallow(
      <ConnectedComponent
        data={{ value: "init" }}
        date={testDate}
        isLoading={false}
      >
        {({ handleOnKeyDown, data }) => {
          keydownHandler = handleOnKeyDown;
          providedData = data;
        }}
      </ConnectedComponent>
    );
    keydownHandler({ target: { value: "test" } });
    expect(providedData).toBe("test");
  });

  it("should update on change if updateOnChange is set to true", () => {
    let onChangeHandler;
    let called = false;
    wrapper = mount(
      <MeterContext.Provider
        value={{
          updateEntry: () => () => {
            called = true;
          }
        }}
      >
        <ConnectedComponent
          data={{ value: "init" }}
          date={testDate}
          updateOnChange
          isLoading={false}
        >
          {({ handleOnChange }) => {
            onChangeHandler = handleOnChange;
          }}
        </ConnectedComponent>
      </MeterContext.Provider>
    );
    onChangeHandler({ target: { value: "test" } });
    expect(called).toBe(true);
  });

  it("should not update on change if updateOnChange is set to false", () => {
    let onChangeHandler;
    let called = false;
    wrapper = mount(
      <MeterContext.Provider
        value={{
          updateEntry: () => () => {
            called = true;
          }
        }}
      >
        <ConnectedComponent
          data={{ value: "init" }}
          date={testDate}
          updateOnChange={false}
          isLoading={false}
        >
          {({ handleOnChange }) => {
            onChangeHandler = handleOnChange;
          }}
        </ConnectedComponent>
      </MeterContext.Provider>
    );
    onChangeHandler({ target: { value: "test" } });
    expect(called).toBe(false);
  });

  it("should provide children with submit entry function", () => {
    let called = false;
    let doSubmit;
    const Test = () => (
      <MeterContext.Provider
        value={{
          updateEntry: () => () => {
            called = true;
          }
        }}
      >
        <ConnectedComponent
          date={testDate}
          updateOnChange={false}
          isLoading={false}
        >
          {({ submitEntry }) => {
            doSubmit = submitEntry;
          }}
        </ConnectedComponent>
      </MeterContext.Provider>
    );
    wrapper = mount(<Test />);
    doSubmit();
    expect(called).toBe(true);
  });

  it("should provide input component with reset function", () => {
    let keydownHandler;
    let providedData;
    let doReset;
    wrapper = shallow(
      <ConnectedComponent
        data={{ value: "init" }}
        date={testDate}
        updateEntry={() => (didUpdate = true)}
        updateOnChange={false}
        isLoading={false}
      >
        {({ data, handleOnKeyDown, reset }) => {
          doReset = reset;
          providedData = data;
          keydownHandler = handleOnKeyDown;
        }}
      </ConnectedComponent>
    );
    // change value and reset
    keydownHandler({ target: { value: "test" } });
    doReset();
    expect(providedData).toBe("init");
  });

  it("should update on blur ", () => {
    let called = false;
    let onBlurHandler;

    const contextValues = {
      updateEntry: () => () => {
        called = true;
      }
    };
    const Test = () => (
      <MeterContext.Provider value={contextValues}>
        <ConnectedComponent data={"init"} date={testDate} isLoading={false}>
          {({ handleOnBlur }) => {
            onBlurHandler = handleOnBlur;
          }}
        </ConnectedComponent>
      </MeterContext.Provider>
    );
    wrapper = mount(<Test />);
    onBlurHandler();
    expect(called).toBe(true);
  });
});
