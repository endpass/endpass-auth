import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Header from '@/components/widget/Header';
import setupI18n from '@/locales/i18nSetup';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';

import web3 from '@/class/singleton/signer/web3';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(Vuex);

describe('Widget Header', () => {
  let wrapper;
  let accountsStore;
  jest.useFakeTimers();

  const wrapperFactory = (options = {}) => {
    const store = createStore();
    const {
      accountsStore: accountsStoreModule,
      gasPriceStore,
    } = createStoreModules(store);

    accountsStore = accountsStoreModule;
    return shallowMount(Header, {
      gasPriceStore,
      accountsStore,
      localVue,
      i18n,
      ...options,
    });
  };

  const mockIterateBalanceOnce = data => {
    const asyncIteratorMock = {};
    asyncIteratorMock[Symbol.asyncIterator] = async function*() {
      yield data;
    };
    web3.iterateBalance.mockImplementationOnce(() => {
      return asyncIteratorMock;
    });
  };

  beforeEach(() => {
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

    it('should not render spinner if balance is passed and should render balance', async () => {
      expect.assertions(2);

      accountsStore.enableAutoUpdateBalance();
      await global.flushPromises();

      expect(wrapper.find('[data-test=balance-label]').exists()).toBe(true);
      expect(wrapper.find('spinner-stub').exists()).toBe(false);
    });

    it('should not render spinner if balance equals to 0 as String ', async () => {
      expect.assertions(2);

      mockIterateBalanceOnce({ result: '0' });
      wrapper = wrapperFactory();
      accountsStore.enableAutoUpdateBalance();
      await global.flushPromises();

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

    it('should render balance in ether', async () => {
      expect.assertions(1);

      mockIterateBalanceOnce({ result: '1000000000000000000' });
      wrapper = wrapperFactory();
      accountsStore.enableAutoUpdateBalance();
      await global.flushPromises();

      expect(wrapper.find('[data-test=balance-label]').text()).toBe('1.000000');
    });

    it('should render balance in fiat', async () => {
      expect.assertions(1);

      mockIterateBalanceOnce({ result: '1000000000000000000' });
      wrapper = wrapperFactory();
      wrapper.setData({
        ethPriceInFiat: '100',
        isBalanceInFiat: true,
      });

      accountsStore.enableAutoUpdateBalance();
      await global.flushPromises();

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

      mockIterateBalanceOnce({ result: '10000000000' });
      accountsStore.enableAutoUpdateBalance();
      await global.flushPromises();

      wrapper.find('[data-test=widget-header]').trigger('click');

      await wrapper.vm.$nextTick();

      expect(wrapper.emitted().toggle).toBeTruthy();
    });

    it('should change balance render mode in currency toggle changes', async () => {
      expect.assertions(2);

      mockIterateBalanceOnce({ result: '1000000000000000000' });
      wrapper = wrapperFactory({
        propsData: {
          fiatCurrency: 'USD',
        },
      });
      wrapper.setData({
        ethPriceInFiat: '100',
      });

      accountsStore.enableAutoUpdateBalance();
      await global.flushPromises();

      expect(wrapper.find('[data-test=balance-label]').text()).toBe('1.000000');

      wrapper.find('currency-toggler-stub').vm.$emit('input', true);

      expect(wrapper.find('[data-test=balance-label]').text()).toBe('100.00');
    });
  });
});
