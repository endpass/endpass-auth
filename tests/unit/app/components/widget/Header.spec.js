import { shallowMount } from '@vue/test-utils';
import Header from '@/components/widget/Header.vue';

describe('Widget Header', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Header);
  });

  describe('render', () => {
    it('should correctly render', () => {
      expect(wrapper.find('[data-test=widget-header-toggler]').text()).toBe(
        'Show more',
      );
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should change toggler label is collapsed is falsy', () => {
      wrapper = shallowMount(Header, {
        propsData: {
          collapsed: false,
        },
      });

      expect(wrapper.find('[data-test=widget-header-toggler]').text()).toBe(
        'Show less',
      );
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit toggle event on toggler click', () => {
      wrapper.find('[data-test=widget-header-toggler]').trigger('click');

      expect(wrapper.emitted().toggle).toBeTruthy();
    });
  });
});
