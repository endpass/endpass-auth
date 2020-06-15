import { shallowMount } from '@vue/test-utils';
import VFrame from '@/components/common/VFrame';

describe('VFrame', () => {
  describe('render', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallowMount(VFrame);
    });

    describe('render', () => {
      it('should correctly render VFrame component without loading screen by default', () => {
        expect(wrapper.name()).toBe('VFrame');
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('should not render logo by default', () => {
        expect(wrapper.find('[data-test=logo]').exists()).toBe(false);
      });

      it('should render logo if prop passed', () => {
        wrapper = shallowMount(VFrame, {
          propsData: {
            isShowLogo: true,
          },
        });

        expect(wrapper.find('[data-test=logo]').exists()).toBe(true);
      });
    });

    describe('behavior', () => {
      it('should emit close on click close button by default', () => {
        wrapper.find('v-modal-card-stub').vm.$emit('close');

        expect(wrapper.emitted().close).toBeTruthy();
      });

      it('should emit return on click return button by default', () => {
        wrapper.find('v-modal-card-stub').vm.$emit('return');

        expect(wrapper.emitted().return).toBeTruthy();
      });
    });
  });
});
