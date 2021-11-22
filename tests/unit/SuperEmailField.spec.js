import { mount } from '@vue/test-utils';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import SuperEmailField from '@/components/SuperEmailField.vue';

describe('SuperEmailField.vue', () => {
  it('matches snapshot', () => {
    const wrapper = mount(SuperEmailField, {
      propsData: { value: '', pattern: '.+@.+..+', placeholder: 'Enter your email here' },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders with passed placeholder', () => {
    const wrapper = mount(SuperEmailField, {
      propsData: { value: '', pattern: '.+@.+..+', placeholder: 'Enter your email here' },
    });

    const input = wrapper.find('.email-input');

    expect(input.element.placeholder).toBe('Enter your email here');
  });

  it('renders with expected error on blur when email is invalid', async () => {
    const wrapper = mount(SuperEmailField, {
      propsData: { value: '1@', pattern: '.+@.+..+', placeholder: 'Enter your email here' },
    });

    const input = wrapper.find('.email-input');

    await input.trigger('blur');

    const error = wrapper.find('.error');

    expect(error.text()).toBe('Please enter valid email!');
  });

  it('has valid class when value is valid', async () => {
    const mock = new MockAdapter(axios);

    mock.onGet(/emailvalidation/).reply(function () {
      return [
        200,
        {
          email: 'vipsarev@gmail.com',
          autocorrect: '',
          deliverability: 'DELIVERABLE',
        },
      ];
    });

    const wrapper = mount(SuperEmailField, {
      propsData: {
        value: '',
        pattern: '.+@.+..+',
        placeholder: 'Enter your email here',
      },
    });

    const input = wrapper.find('.email-input');

    await input.setValue('vipsarev@gmail.com');
    await input.trigger('keyup');

    //wait for debounce callback
    await new Promise((resolve) => setTimeout(resolve, 600));

    expect(input.classes('valid')).toBe(true);
  });
});
