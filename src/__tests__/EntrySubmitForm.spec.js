import React from 'react';
import Button from "@material-ui/core/Button";
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { EntrySubmitForm } from '../components/common/EntrySubmitForm';

configure({ adapter: new Adapter() });

describe('EntrySubmitForm', () => {
  it('should render numbers', () => {
    const wrapper = shallow(<EntrySubmitForm />);
    expect(wrapper.find(Button).length).toBe(1);
  });
});