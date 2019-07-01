import { shallowMount, createLocalVue } from '@vue/test-utils';
import Header from '@/components/widget/Header.vue';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);
describe('Widget Header', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Header, {
      localVue,
      i18n,
    });
  });

  describe('render', () => {
    it('should correctly render', () => {
      expect(wrapper.find('[data-test=widget-header-status]').text()).toBe(
        'Show more',
      );
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render spinner if balance is not passed', () => {
      expect(wrapper.find('spinner-stub').exists()).toBe(true);
    });

    it('should not render spinner if balance is passed and should render balance', () => {
      wrapper = shallowMount(Header, {
        localVue,
        i18n,
        propsData: {
          balance: '1000',
        },
      });

      expect(wrapper.find('[data-test=balance-label]').exists()).toBe(true);
      expect(wrapper.find('spinner-stub').exists()).toBe(false);
    });

    it('should not render spinner if balance equals to stringified 0', () => {
      wrapper = shallowMount(Header, {
        localVue,
        i18n,
        propsData: {
          balance: '0',
        },
      });

      expect(wrapper.find('[data-test=balance-label]').exists()).toBe(true);
      expect(wrapper.find('spinner-stub').exists()).toBe(false);
    });

    it('should change status label is collapsed is falsy', () => {
      wrapper = shallowMount(Header, {
        localVue,
        i18n,
        propsData: {
          isCollapsed: false,
        },
      });

      expect(wrapper.find('[data-test=widget-header-status]').text()).toBe(
        'Show less',
      );
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit toggle event on header click', () => {
      wrapper.find('[data-test=widget-header]').trigger('click');

      expect(wrapper.emitted().toggle).toBeTruthy();
    });
  });
});
