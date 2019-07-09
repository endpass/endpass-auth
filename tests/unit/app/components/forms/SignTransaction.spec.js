import Vuex from 'vuex';
import VeeValidate from 'vee-validate';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import validation from '@/validation';
import SignTransaction from '@/components/forms/SignTransaction.vue';
import setupI18n from '@/locales/i18nSetup';
import {
  requestWithMessage,
  requestWithTransaction,
} from '@unitFixtures/requests';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(VeeValidate);
localVue.use(validation);
localVue.use(Vuex);

describe('SignTransaction', () => {
  let store;
  let storeData;
  let gasPriceModule;

  beforeEach(() => {
    gasPriceModule = {
      actions: {
        getGasPrice: jest.fn().mockResolvedValue({
          low: 1,
          medium: 2,
          high: 3,
        }),
      },
    };
    storeData = {
      modules: {
        gasPrices: gasPriceModule,
      },
    };
    store = new Vuex.Store(storeData);
  });

  describe('render', () => {
    const wrapperFactory = (props = {}) =>
      shallowMount(SignTransaction, {
        localVue,
        i18n,
        store,
        sync: false,
        propsData: props,
        provide: {
          theme: 'default',
        },
      });

    let wrapper;

    beforeEach(() => {
      wrapper = wrapperFactory({
        request: requestWithMessage,
      });
    });

    it('should correctly render SignTransaction component', () => {
      expect(wrapper.name()).toBe('SignTransactionForm');
      expect(wrapper.find('[data-test=requester-url]').text()).toBe(
        requestWithMessage.url,
      );
      expect(wrapper.find('[data-test=error-message]').exists()).toBe(false);
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should not render requester url if it is not passed', () => {
      wrapper = wrapperFactory({
        request: {
          ...requestWithMessage,
          url: null,
        },
      });

      expect(wrapper.find('[data-test=requester-url]').exists()).toBe(false);
    });

    it('should change submit button text if loading and make it disabled', () => {
      wrapper = wrapperFactory({
        loading: true,
        request: requestWithMessage,
      });

      const submitButton = wrapper.find('[data-test=submit-button]');

      expect(submitButton.text()).toBe('Loading...');
      expect(submitButton.attributes().disabled).toBe('true');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    const wrapperFactory = (props = {}) =>
      mount(SignTransaction, {
        localVue,
        i18n,
        store,
        sync: false,
        propsData: props,
        provide: {
          theme: 'default',
        },
      });
    let wrapper;

    beforeEach(() => {
      wrapper = wrapperFactory({
        request: requestWithMessage,
      });
    });

    it('should not allow submit form if password is empty', () => {
      wrapper.find('[data-test=submit-button]').vm.$emit('click');

      expect(wrapper.emitted().submit).toBe(undefined);
    });

    it('should allow submit if password is valid', async () => {
      expect.assertions(1);

      wrapper.setData({
        password: 'foofoofoo',
      });
      // TODO: crutch for correct form validation handling
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-test=submit-button]').attributes().disabled,
      ).toBeFalsy();
    });

    it('should submit transaction data', async () => {
      expect.assertions(1);

      wrapper = wrapperFactory({
        request: requestWithTransaction,
        isTransaction: true,
      });
      wrapper.setData({
        password: 'foofoofoo',
      });
      // TODO: crutch for correct form validation handling
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.find('[data-test=submit-button]').vm.$emit('click');

      expect(wrapper.emitted().submit).toEqual([
        [
          {
            password: 'foofoofoo',
            account: requestWithMessage.address,
            transaction: expect.any(Object),
          },
        ],
      ]);
    });

    it('should cancel sign on cancel button press', () => {
      wrapper.find('[data-test=cancel-button]').trigger('click');

      expect(wrapper.emitted().cancel).toEqual([[]]);
    });
  });
});
