import React from "react";
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";

import {CreateSchemaDialog} from "./CreateSchemaDialog";

configure({ adapter: new Adapter() });

describe('CreateSchemaDialog', () => {

  it('should render', () => {
    const wrapper = shallow(
      <CreateSchemaDialog
        classes={{
          container: ''
        }}
        fetchSchemas={jest.fn()}
      />
    );
    expect(wrapper.find(Dialog)).toHaveLength(1);
  });

  it('should not submit a schema if no schema is given', () => {
    const wrapper = shallow(
      <CreateSchemaDialog
        classes={{
          container: ''
        }}
        open={true}
        fetchSchemas={jest.fn()}
      />
    );
    const button = wrapper.find(Button).first(0);
    button.simulate('click');
    expect(wrapper.state().schemaNameError).toBe('No schema name given');
    expect(wrapper.state().schemaError).toBe('No schema given');
  });

  it('should not submit a schema if no schema name is given', () => {
    const wrapper = shallow(
      <CreateSchemaDialog
        classes={{
          container: ''
        }}
        open={true}
        fetchSchemas={jest.fn()}
      />
    );
    const button = wrapper.find(Button).first(0);

    const schema = JSON.stringify({ "type": "integer" });
    wrapper.find(TextField).at(1).simulate('change', { target: { value: schema } });
    button.simulate('click');
    expect(wrapper.state().schemaNameError).toBe('No schema name given');
    expect(wrapper.state().schemaError).toBe(undefined);
  });

  it('should not submit a schema if no schema is given', () => {
    const wrapper = shallow(
      <CreateSchemaDialog
        classes={{
          container: ''
        }}
        open={true}
        fetchSchemas={jest.fn()}
      />
    );
    const button = wrapper.find(Button).first(0);

    wrapper.find(TextField).at(0).simulate('change', { target: { value: "test schema" } });
    button.simulate('click');
    expect(wrapper.state().schemaNameError).toBe(undefined);
    expect(wrapper.state().schemaError).toBe("No schema given");
  });
});