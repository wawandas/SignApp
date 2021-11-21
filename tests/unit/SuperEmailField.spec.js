import { mount } from '@vue/test-utils';
import SuperEmailField from '@/components/SuperEmailField.vue';

describe('SuperEmailField.vue', () => {
  it('initialy renders with passed placeholder', () => {
    const wrapper = mount(SuperEmailField, {
      propsData: { value: 'test', pattern: '.+@.+..+', placeholder: 'Enter your email here' },
    });

    const input = wrapper.find('.email-input');

    console.log(input);

    expect(input.element.placeholder).toBe('Enter your email here');
  });
});
