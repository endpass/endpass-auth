import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Header from '@/components/widget/Header';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(Vuex);

describe('Widget Header', () => {
  let wrapperFactory;
  let wrapper;

  beforeEach(() => {
    wrapperFactory = (options = {}) =>
      shallowMount(Header, {
        localVue,
        i18n,
        ...options,
      });
    wrapper = wrapperFactory();
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

    it('should render spinner if current mode is fiat and eth price is not defined', () => {
      wrapper = wrapperFactory({
        propsData: {
          balance: '1000',
        },
      });
      wrapper.setData({
        isBalanceInFiat: true,
      });

      expect(wrapper.find('spinner-stub').exists()).toBe(true);
    });

    it('should not render spinner if balance is passed and should render balance', () => {
      wrapper = wrapperFactory({
        propsData: {
          balance: '1000',
        },
      });

      expect(wrapper.find('[data-test=balance-label]').exists()).toBe(true);
      expect(wrapper.find('spinner-stub').exists()).toBe(false);
    });

    it('should not render spinner if balance equals to stringified 0', () => {
      wrapper = wrapperFactory({
        propsData: {
          balance: '0',
        },
      });

      expect(wrapper.find('[data-test=balance-label]').exists()).toBe(true);
      expect(wrapper.find('spinner-stub').exists()).toBe(false);
    });

    it('should change status label is collapsed is falsy', () => {
      wrapper = wrapperFactory({
        propsData: {
          isCollapsed: false,
        },
      });

      expect(wrapper.find('[data-test=widget-header-status]').text()).toBe(
        'Show less',
      );
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render balance in ether', () => {
      wrapper = wrapperFactory({
        propsData: {
          balance: '1000000000000000000',
        },
      });

      expect(wrapper.find('[data-test=balance-label]').text()).toBe('1.000000');
    });

    it('should render balance in fiat', () => {
      wrapper = wrapperFactory({
        propsData: {
          balance: '1000000000000000000',
        },
      });
      wrapper.setData({
        ethPriceInFiat: '100',
        isBalanceInFiat: true,
      });

      expect(wrapper.find('[data-test=balance-label]').text()).toBe('100.00');
    });
  });

  describe('behavior', () => {
    it('should emit not toggle event on header click if loading is truthy', async () => {
      expect.assertions(1);

      wrapper.find('[data-test=widget-header]').trigger('click');

      await wrapper.vm.$nextTick();

      expect(wrapper.emitted().toggle).toBeFalsy();
    });

    it('should emit toggle event on header click if loading is falsy', async () => {
      expect.assertions(1);

      wrapper.setProps({
        balance: '10000000000',
      });
      wrapper.find('[data-test=widget-header]').trigger('click');

      await wrapper.vm.$nextTick();

      expect(wrapper.emitted().toggle).toBeTruthy();
    });

    it('should change balance render mode in currency toggler changes', () => {
      wrapper = wrapperFactory({
        propsData: {
          balance: '1000000000000000000',
          fiatCurrency: 'USD',
        },
      });
      wrapper.setData({
        ethPriceInFiat: '100',
      });

      expect(wrapper.find('[data-test=balance-label]').text()).toBe('1.000000');

      wrapper.find('currency-toggler-stub').vm.$emit('input', true);

      expect(wrapper.find('[data-test=balance-label]').text()).toBe('100.00');
    });
  });
});
