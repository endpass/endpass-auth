import Vuex from 'vuex';
import VeeValidate from 'vee-validate';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import validation from '@/validation';
import TransactionForm from '@/components/forms/Sign/TransactionForm.vue';
import setupI18n from '@/locales/i18nSetup';
import {
  requestWithTransaction,
  requestWithCuttedTransaction,
} from '@unitFixtures/requests';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(Vuex);
localVue.use(VeeValidate);
localVue.use(validation);

describe('Sign > TransactionForm', () => {
  let store;
  let storeData;
  let gasPriceModule;
  let wrapperFactory;
  let wrapper;

  beforeEach(() => {
    gasPriceModule = {
      actions: {
        getGasPrices: jest.fn(),
        getGasLimitByAddress: jest.fn(),
      },
    };
    storeData = {
      modules: {
        gasPrice: gasPriceModule,
      },
    };
    store = new Vuex.Store(storeData);
    wrapperFactory = (props = {}) =>
      shallowMount(TransactionForm, {
        localVue,
        i18n,
        store,
        sync: false,
        propsData: props,
        provide: {
          theme: 'default',
        },
      });
    wrapper = wrapperFactory({
      request: requestWithTransaction,
    });
  });

  describe('render', () => {
    it('should render component and has correct name', () => {
      expect(wrapper.name()).toEqual('SignTransactionForm');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should requests gas prices on mount', async () => {
      expect.assertions(2);

      await global.flushPromises();

      expect(gasPriceModule.actions.getGasPrices).toBeCalledTimes(1);
      expect(gasPriceModule.actions.getGasLimitByAddress).not.toBeCalled();
    });

    it('should requests gas limit on mount if it is not defined in transaction', async () => {
      expect.assertions(1);

      wrapper = wrapperFactory({
        request: requestWithCuttedTransaction,
      });
      await global.flushPromises();

      expect(gasPriceModule.actions.getGasLimitByAddress).toBeCalledTimes(1);
    });

    it('should handle base form submit and bubble it', () => {
      const payload = {
        account: '0x123',
        password: '123',
      };

      wrapper.find('base-form-stub').vm.$emit('submit', payload);

      expect(wrapper.emitted().submit).toEqual([[payload]]);
    });
  });
});
