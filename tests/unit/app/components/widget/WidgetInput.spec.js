import { shallowMount } from '@vue/test-utils';
import WidgetInput from '@/components/widget/WidgetInput.vue';

describe('components > widget > WidgetInput', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(WidgetInput);
  });

  it('should be vue component', () => {
    expect(wrapper.name()).toBe('WidgetInput');
  });

  it('should correctly render component', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
