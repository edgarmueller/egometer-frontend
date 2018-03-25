import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ConnectedComponent from "../components/common/ConnectedComponent";
import { testDate } from '../__mocks__/testData';

configure({ adapter: new Adapter() });

describe('ConnectedComponent', () => {
  it('should render its input component', () => {
    const wrapper = shallow(
      <ConnectedComponent
        date={testDate}
        inputComponent={() => (<div>Test</div>)}
        updateEntry={jest.fn()}
      />
    );
    expect(wrapper.find('div').length).toBe(1);
  });

  it('should only update on change if updateOnChange is set', () => {
    let didUpdate = false;
    const wrapper = shallow(
      <ConnectedComponent
        data={'init'}
        date={testDate}
        inputComponent={() => (<div>Test</div>)}
        updateEntry={() => didUpdate = true }
        updateOnChange
      />
    );
    wrapper.instance().handleOnChange({ target: { value: 'test' }});
    expect(wrapper.state().text).toBe('test');
    expect(didUpdate).toBe(true);
  });

  it('should not update on change if updateOnChange is set to false', () => {
    let didUpdate = false;
    const wrapper = shallow(
      <ConnectedComponent
        data={'init'}
        date={testDate}
        inputComponent={() => (<div>Test</div>)}
        updateEntry={() => didUpdate = true }
        updateOnChange={false}
      />
    );
    wrapper.instance().handleOnChange({ target: { value: 'test' }});
    expect(didUpdate).toBe(false);
  });

  it('should provide input component with submit entry function', () => {
    let didUpdate = false;
    const wrapper = shallow(
      <ConnectedComponent
        date={testDate}
        inputComponent={({ reset, submitEntry }) => {
          submitEntry();
        } }
        updateEntry={() => didUpdate = true }
        updateOnChange={false}
      />
    );
    expect(didUpdate).toBe(true);
  });

  it('should provide input component with reset function', () => {
    let doReset = jest.fn();
    const wrapper = shallow(
      <ConnectedComponent
        data={'init'}
        date={testDate}
        inputComponent={({ reset}) => {
          doReset = reset;
        } }
        updateEntry={() => didUpdate = true }
        updateOnChange={false}
      />
    );
    wrapper.instance().handleOnChange({ target: { value: 'test' }});
    doReset();
    expect(wrapper.state().text).toBe('init');
  });

  it('should update via key', () => {
    const wrapper = shallow(
      <ConnectedComponent
        data={'init'}
        date={testDate}
        inputComponent={jest.fn()}
        updateEntry={jest.fn()}
      />
    );
    wrapper.instance().handleOnKeyDown({ target: { value: 'test' }});
    expect(wrapper.state().text).toBe('test');
  });

  it('should update via key when pressed enter', () => {
    let didUpdate = false;
    const wrapper = shallow(
      <ConnectedComponent
        data={'init'}
        date={testDate}
        inputComponent={jest.fn()}
        updateEntry={() => didUpdate = true}
      />
    );
    wrapper.instance().handleOnKeyDown({ key: 'Enter', target: { value: 'test' }});
    expect(wrapper.state().text).toBe('test');
    expect(didUpdate).toBe(true);
  });

  // TODO: test for rendering ConnectedComponent once initially,
  // then update data prop
  // Expectation: state.text prop should not update
  it('data prop should provide initial data', () => {
    const wrapper = shallow(
      <ConnectedComponent
        data={'init'}
        date={testDate}
        inputComponent={jest.fn()}
        updateEntry={jest.fn()}
      />
    );
    wrapper.setProps({ data: 'foo' });
    expect(wrapper.state().text).toBe('init');
  });

  it('data prop should only update state if date differs', () => {
    const wrapper = shallow(
      <ConnectedComponent
        data={'init'}
        date={testDate}
        inputComponent={jest.fn()}
        updateEntry={jest.fn()}
      />
    );
    wrapper.setProps({
      'data': 'foo',
      'date': '2018-07-30'
    });
    expect(wrapper.state().text).toBe('foo');
  });
});