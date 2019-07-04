import Vuex from 'vuex';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Sign from '@/components/forms/Sign.vue';
import setupI18n from '@/locales/i18nSetup';
import {
  requestWithMessage,
  requestWithTransaction,
} from '@unitFixtures/requests';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(Vuex);

describe('Sign', () => {
  let store;
  let storeData;
  let gasPriceModule;

  beforeEach(() => {
    gasPriceModule = {
      getters: {
        labeledGasPricesList: jest.fn(() => [
          {
            label: '1 gwei',
            value: '2',
          },
          {
            label: '2 gwei',
            value: '2',
          },
          {
            label: '3 gwei',
            value: '1',
          },
        ]),
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
      shallowMount(Sign, {
        localVue,
        i18n,
        store,
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

    it('should correctly render Sign component', () => {
      expect(wrapper.name()).toBe('SignForm');
      expect(wrapper.find('[data-test=sign-form-message]').exists()).toBe(true);
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

    it('should not render request body code if it is not passed', () => {
      wrapper = wrapperFactory({
        request: {
          ...requestWithMessage,
          request: null,
        },
      });

      expect(
        wrapper.find('[data-test=sign-form-transaction-params]').exists(),
      ).toBe(false);
      expect(wrapper.find('[data-test=sign-form-message]').exists()).toBe(
        false,
      );
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

    it('should render message for requests with just messages', () => {
      expect(
        wrapper.find('[data-test=sign-form-transaction-params]').exists(),
      ).toBe(false);
      expect(wrapper.find('[data-test=sign-form-message]').exists()).toBe(true);
    });

    it('should render transaction form for requests with transactions', () => {
      wrapper = wrapperFactory({
        loading: false,
        isTransaction: true,
        request: requestWithTransaction,
      });

      expect(wrapper.find('[data-test=sign-form-message]').exists()).toBe(
        false,
      );
      expect(
        wrapper.find('[data-test=sign-form-transaction-params]').exists(),
      ).toBe(true);
    });
  });

  describe('behavior', () => {
    const wrapperFactory = (props = {}) =>
      mount(Sign, {
        localVue,
        i18n,
        store,
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
      wrapper.find('form').trigger('submit');

      expect(wrapper.emitted().submit).toBe(undefined);
    });

    it('should allow submit of email is valid', () => {
      wrapper.setData({
        password: 'foo',
      });

      wrapper.find('form').trigger('submit');

      expect(wrapper.emitted().submit).toEqual([
        [
          {
            password: 'foo',
            account: requestWithMessage.address,
          },
        ],
      ]);
    });

    it('should submit transaction data', () => {
      wrapper = wrapperFactory({
        request: requestWithTransaction,
        isTransaction: true,
      });
      wrapper.setData({
        password: 'foo',
      });

      wrapper.find('form').trigger('submit');

      expect(wrapper.emitted().submit).toEqual([
        [
          {
            password: 'foo',
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
