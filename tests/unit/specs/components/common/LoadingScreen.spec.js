import { shallowMount } from '@vue/test-utils';
import LoadingScreen from '@/components/common/LoadingScreen';

describe('LoadingScreen', () => {
  describe('render', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallowMount(LoadingScreen);
    });

    it('should correctly render LoadingScreen component', () => {
      expect(wrapper.name()).toBe('LoadingScreen');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
