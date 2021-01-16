import React from "react";
import { act } from "react-dom/test-utils";
import { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ConnectedComponent from "./ConnectedComponent";
import { testDate } from "../../__mocks__/fixtures";
import { MeterContext } from "../../context";

configure({ adapter: new Adapter() });

describe("ConnectedComponent", () => {
  let wrapper;

  afterEach(() => {
    jest.clearAllMocks();
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it("should render its children", () => {
    wrapper = shallow(
      <ConnectedComponent date={testDate} isLoading={false} meterId="dummyId">
        {() => <div>Test</div>}
      </ConnectedComponent>
    );
    expect(wrapper.find("div").length).toBe(1);
  });

  it("should pass data property", () => {
    let val;
    wrapper = shallow(
      <ConnectedComponent
        data={{ value: "foo" }}
        date={testDate}
        isLoading={false}
        meterId="dummyId"
      >
        {({ data }) => {
          val = data;
          return <div>Test</div>;
        }}
      </ConnectedComponent>
    );

    //wrapper.setProps({ data: })
    expect(val).toBe("foo");
  });

  it("should pass updated data to children", () => {
    let val;
    const wrapper = mount(
      <ConnectedComponent
        data={{ value: "foo" }}
        date={testDate}
        isLoading={false}
        meterId="dummyId"
      >
        {({ data }) => {
          val = data;
          return <div>Test</div>;
        }}
      </ConnectedComponent>
    );

    wrapper.setProps({ data: { value: "bar" } });
    wrapper.update();
    expect(val).toBe("bar");
    wrapper.unmount();
  });

  it("should pass updated empty data to children", () => {
    let val;
    const wrapper = mount(
      <ConnectedComponent
        data={{ value: "foo" }}
        date={testDate}
        isLoading={false}
        meterId="dummyId"
      >
        {({ data }) => {
          val = data;
          return <div>Test</div>;
        }}
      </ConnectedComponent>
    );

    wrapper.setProps({ data: { value: "" } });
    wrapper.update();
    expect(val).toBe("");
    wrapper.unmount();
  });

  it("should provide data to its children", () => {
    const wrapper = mount(
      <ConnectedComponent
        data={{ value: "init" }}
        date={testDate}
        updateEntry={jest.fn()}
        isLoading={false}
        meterId="dummyId"
      >
        {({ data }) => {
          return <div>{data}</div>;
        }}
      </ConnectedComponent>
    );
    wrapper.setProps({ data: { value: "foo" } });
    wrapper.update();
    expect(wrapper.find("div").childAt(0).text()).toBe("foo");
    wrapper.unmount();
  });

  it("should update its internal data via updateValue", () => {
    let updateValueHandler;
    let providedData;
    shallow(
      <ConnectedComponent
        data={{ value: "init" }}
        date={testDate}
        isLoading={false}
        updateOnChange={false}
        meterId="dummyId"
      >
        {({ updateValue, data }) => {
          updateValueHandler = updateValue;
          providedData = data;
        }}
      </ConnectedComponent>
    );
    updateValueHandler({ target: { value: "test" } });
    expect(providedData).toBe("test");
  });

  it("should emit value if updateOnChange is set to true", () => {
    let updateValueHandler;
    let called = false;
    wrapper = mount(
      <MeterContext.Provider
        value={{
          updateEntry: () => () => {
            called = true;
          },
        }}
      >
        <ConnectedComponent
          data={{ value: "init" }}
          date={testDate}
          updateOnChange
          isLoading={false}
          meterId="dummyId"
        >
          {({ updateValue }) => {
            updateValueHandler = updateValue;
          }}
        </ConnectedComponent>
      </MeterContext.Provider>
    );
    act(() => updateValueHandler({ target: { value: "test" } }));
    expect(called).toBe(true);
  });

  it("should not emit value if updateOnChange is set to false", () => {
    let updateValueHandler;
    let called = false;
    wrapper = mount(
      <MeterContext.Provider
        value={{
          updateEntry: () => () => {
            called = true;
          },
        }}
      >
        <ConnectedComponent
          data={{ value: "init" }}
          date={testDate}
          updateOnChange={false}
          isLoading={false}
          meterId="dummyId"
        >
          {({ updateValue }) => {
            updateValueHandler = updateValue;
          }}
        </ConnectedComponent>
      </MeterContext.Provider>
    );
    act(() => updateValueHandler({ target: { value: "test" } }));
    expect(called).toBe(false);
  });

  it("should provide children with submit entry function", () => {
    let called = false;
    let doSubmit;
    let updateValueHandler;
    const Test = () => (
      <MeterContext.Provider
        value={{
          updateEntry: () => () => {
            called = true;
          },
        }}
      >
        <ConnectedComponent
          date={testDate}
          updateOnChange={false}
          isLoading={false}
          meterId="dummyId"
        >
          {({ submitEntry, updateValue }) => {
            updateValueHandler = updateValue;
            doSubmit = submitEntry;
          }}
        </ConnectedComponent>
      </MeterContext.Provider>
    );
    wrapper = mount(<Test />);
    act(() => updateValueHandler({ target: { value: 42 } }));
    doSubmit();
    expect(called).toBe(true);
  });

  it("should provide children with reset function", () => {
    let updateValueHandler;
    let providedData;
    let doReset;
    wrapper = shallow(
      <ConnectedComponent
        data={{ value: "init" }}
        date={testDate}
        updateEntry={() => (didUpdate = true)}
        updateOnChange={false}
        isLoading={false}
        meterId="dummyId"
      >
        {({ data, updateValue, reset }) => {
          doReset = reset;
          providedData = data;
          updateValueHandler = updateValue;
        }}
      </ConnectedComponent>
    );
    // change value and reset
    updateValueHandler({ target: { value: "test" } });
    doReset();
    expect(providedData).toBe("init");
  });
});
