import Vuex from 'vuex';
import VeeValidate from 'vee-validate';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import {
  requestWithTransaction,
  requestWithCuttedTransaction,
} from '@unitFixtures/requests';
import validation from '@/validation';
import TransactionForm from '@/components/forms/Sign/TransactionForm';
import setupI18n from '@/locales/i18nSetup';
import createStore from '@/store/createStore';
import createStores from '@/store/createStores';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(Vuex);
localVue.use(VeeValidate);
localVue.use(validation);

describe('Sign > TransactionForm', () => {
  let wrapperFactory;
  let wrapper;

  beforeEach(() => {
    wrapperFactory = (props = {}) => {
      const store = createStore();
      const { accountsStore, gasPriceStore } = createStores(store);
      return shallowMount(TransactionForm, {
        accountsStore,
        gasPriceStore,
        localVue,
        i18n,
        sync: false,
        propsData: props,
        provide: {
          theme: 'default',
        },
      });
    };
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
    it('should requests gas prices and fiat price on mount', async () => {
      expect.assertions(2);

      await global.flushPromises();

      expect(
        wrapper.find('[data-test=value-fiat-input]').attributes().value,
      ).toBe('98114.98');
      expect(
        wrapper.find('[data-test=gas-limit-input]').attributes().value,
      ).toBe('60678575854435905636937776');
    });

    it('should requests gas limit on mount if it is not defined in transaction', async () => {
      expect.assertions(2);

      wrapper = wrapperFactory({
        request: requestWithCuttedTransaction,
      });
      await global.flushPromises();

      expect(
        wrapper.find('[data-test=value-fiat-input]').attributes().value,
      ).toBe('98114.98');
      expect(
        wrapper.find('[data-test=gas-limit-input]').attributes().value,
      ).toBe('21000');
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
