import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TableRow from '@material-ui/core/TableRow';

import {Schemas} from './SchemaList';
import {moodEntries, moodMeterId, moodSchema} from '../../__mocks__/fixtures';
import CreateSchemaDialog from "./CreateSchemaDialog";
import {ShowMessageDialog} from "../common/ShowMessageDialog";

configure({ adapter: new Adapter() });

describe('SchemaList', () => {
  it('should render all given schemas', () => {
    const entries = {};
    entries[moodMeterId] = moodEntries;
    const wrapper = shallow(
      <Schemas
        classes={{
          display1: undefined
        }}
        schemas={[moodSchema]}
      />
    );
    // header + schema
    expect(wrapper.find(TableRow).length).toEqual(2);
  });

  it('should open a schema creation dialog', () => {
    const wrapper = shallow(
      <Schemas
        classes={{
          display1: undefined
        }}
        schemas={[moodSchema]}
      />
    );
    wrapper.instance().handleCreate();
    expect(wrapper.find(CreateSchemaDialog).length).toBe(1);
  })

  it('should open schema display dialog', () => {
    const wrapper = shallow(
      <Schemas
        classes={{
          display1: undefined
        }}
        schemas={[moodSchema]}
      />
    );
    wrapper.instance().handleClickShow(moodSchema);
    expect(wrapper.find(ShowMessageDialog).length).toBe(1);
  })
});
