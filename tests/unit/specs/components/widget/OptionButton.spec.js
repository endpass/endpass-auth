import { shallowMount } from '@vue/test-utils';
import OptionButton from '@/components/widget/OptionButton';

describe('OptionButton', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(OptionButton);
  });

  it('should correctly render', () => {
    expect(wrapper.find('div').exists()).toBe(false);
  });
});
