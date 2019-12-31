import React from "react";
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {ShowMessageDialog} from "./ShowMessageDialog";
import DialogContentText from "@material-ui/core/DialogContentText";

configure({ adapter: new Adapter() });

describe('ShowMessageDialog', () => {
  it("should show message", () => {
    const wrapper = shallow(<ShowMessageDialog text={"test message"}/>);
    expect(wrapper.find(DialogContentText).dive().childAt(0).text()).toBe("test message");
  });
});