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

    it('should render spinner if balance is not passed', () => {
      expect(wrapper.find('spinner-stub').exists()).toBe(true);
    });

    it('should not render spinner if balance is passed and should render balance', () => {
      wrapper = shallowMount(Header, {
        propsData: {
          balance: '1000',
        },
      });

      expect(wrapper.find('[data-test=balance-label]').exists()).toBe(true);
      expect(wrapper.find('spinner-stub').exists()).toBe(false);
    });

    it('should not render spinner if balance equals to stringified 0', () => {
      wrapper = shallowMount(Header, {
        propsData: {
          balance: '0',
        },
      });

      expect(wrapper.find('[data-test=balance-label]').exists()).toBe(true);
      expect(wrapper.find('spinner-stub').exists()).toBe(false);
    });

    it('should change toggler label is collapsed is falsy', () => {
      wrapper = shallowMount(Header, {
        propsData: {
          isCollapsed: false,
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
