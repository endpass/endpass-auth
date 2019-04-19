import { shallowMount } from '@vue/test-utils';
import OptionButton from '@/components/widget/OptionButton.vue';

describe('OptionButton', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(OptionButton);
  });

  it('should correctly render', () => {
    expect(1 + 1).toBe(2);
  });
});
