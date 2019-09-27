import { shallowMount } from '@vue/test-utils';
import Content from '@/components/widget/Content';

describe('Widget Content', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Content);
  });

  describe('render', () => {
    it('should correctly render', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
