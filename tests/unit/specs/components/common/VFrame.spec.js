import { shallowMount } from '@vue/test-utils';
import VFrame from '@/components/common/VFrame.vue';

describe('VFrame', () => {
  describe('render', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallowMount(VFrame);
    });

    it('should correctly render VFrame component without loading screen by default', () => {
      expect(wrapper.name()).toBe('VFrame');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render loading screen if loading passed as true', () => {
      wrapper = shallowMount(VFrame, {
        propsData: {
          isLoading: true,
        },
      });

      expect(wrapper.find('spinner-stub').exists()).toBe(true);
    });

    describe('close feature', () => {
      it('should emit close on click close button by default', () => {
        wrapper.find('v-modal-card-stub').vm.$emit('close');

        expect(wrapper.emitted().close).toBeTruthy();
      });
    });
  });
});
