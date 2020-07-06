import * as React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import OakButton from './OakButton';

const mockStore = configureMockStore([thunk]);

const store = mockStore({ profile: { theme: ['theme_light'] } });
describe('button component interaction', () => {
  it('should load when initialized', () => {
    const wrapper = mount(
      <Provider store={store}>
        <OakButton />
      </Provider>
    );
    expect(wrapper.find('.oak-button')).toHaveLength(1);
  });

  it('should invoke the callback function when clicked', () => {
    const mockAction = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <OakButton action={mockAction} />
      </Provider>
    );
    expect(mockAction.mock.calls.length).toEqual(0);
    wrapper.find('button').simulate('click');
    expect(mockAction.mock.calls.length).toEqual(1);
    wrapper.find('button').simulate('click');
    expect(mockAction.mock.calls.length).toEqual(2);
  });
});

describe('button component conditional styling', () => {
  it('should have choosen theme', () => {
    const wrapperWithPrimaryTheme = mount(
      <Provider store={store}>
        <OakButton theme="primary" />
      </Provider>
    );
    expect(
      wrapperWithPrimaryTheme.find('.oak-button').hasClass('primary')
    ).toBeTruthy();
    expect(
      wrapperWithPrimaryTheme.find('.oak-button').hasClass('default')
    ).toBeFalsy();
    const wrapperWithDefaultTheme = mount(
      <Provider store={store}>
        <OakButton theme="default" />
      </Provider>
    );
    expect(
      wrapperWithDefaultTheme.find('.oak-button').hasClass('primary')
    ).toBeFalsy();
    expect(
      wrapperWithDefaultTheme.find('.oak-button').hasClass('default')
    ).toBeTruthy();
    const wrapperWithNoTheme = mount(
      <Provider store={store}>
        <OakButton />
      </Provider>
    );
    expect(
      wrapperWithNoTheme.find('.oak-button').hasClass('primary')
    ).toBeFalsy();
    expect(
      wrapperWithNoTheme.find('.oak-button').hasClass('default')
    ).toBeFalsy();
  });

  it('should render child elements as label', () => {
    const wrapper = mount(
      <Provider store={store}>
        <OakButton>Test label</OakButton>
      </Provider>
    );
    expect(wrapper.find('.oak-button').text()).toEqual('Test label');
  });

  it('should align the text to direction passed as input', () => {
    const wrapper = mount(
      <Provider store={store}>
        <OakButton align="left" />
      </Provider>
    );
    expect(wrapper.find('.oak-button').hasClass('align-left')).toBeTruthy();
    expect(wrapper.find('.oak-button').hasClass('align-right')).toBeFalsy();
  });

  it('should render the chosen variant', () => {
    const wrapper = mount(
      <Provider store={store}>
        <OakButton variant="appear" />
      </Provider>
    );
    expect(wrapper.find('.oak-button').hasClass('appear')).toBeTruthy();
    expect(wrapper.find('.oak-button').hasClass('outline')).toBeFalsy();
  });

  it('should render as small button when small is passed as input', () => {
    const smallWrapper = mount(
      <Provider store={store}>
        <OakButton small />
      </Provider>
    );
    const normalWrapper = mount(
      <Provider store={store}>
        <OakButton />
      </Provider>
    );
    expect(smallWrapper.find('.oak-button').hasClass('small')).toBeTruthy();
    expect(normalWrapper.find('.oak-button').hasClass('small')).toBeFalsy();
  });
});
