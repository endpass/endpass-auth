import Vuex from 'vuex';
import VeeValidate from 'vee-validate';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { requestWithMessage } from '@unitFixtures/requests';
import validation from '@/validation';
import BaseForm from '@/components/forms/Sign/BaseForm';
import setupI18n from '@/locales/i18nSetup';
import Wallet from '@/class/singleton/signer/Wallet';
import createStore from '@/store/createStore';
import createStores from '@/store/createStores';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(Vuex);
localVue.use(VeeValidate);
localVue.use(validation);

describe('Sign > BaseForm', () => {
  let wrapperFactory;
  let wrapper;

  beforeEach(() => {
    wrapperFactory = (props = {}) => {
      const store = createStore();
      const { accountsStore } = createStores(store);

      return shallowMount(BaseForm, {
        accountsStore,
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
      request: requestWithMessage,
      isFormValid: true,
    });
  });

  describe('render', () => {
    it('should render component and has correct name', () => {
      expect(wrapper.name()).toEqual('SignBaseForm');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render requester url', () => {
      expect(wrapper.find('[data-test=requester-url]').exists()).toBe(true);
    });

    it('should render request sender address', () => {
      expect(wrapper.find('[data-test=account-address]').exists()).toBe(true);
    });
  });

  describe('behavior', () => {
    it('should handle base form submit and bubble it', async () => {
      expect.assertions(1);

      const payload = {
        account: requestWithMessage.address,
        password: '123',
      };

      wrapper.setData({
        password: payload.password,
      });

      await wrapper.vm.$nextTick();

      wrapper.find('[data-test=submit-button]').vm.$emit('click');

      await global.flushPromises();

      expect(wrapper.emitted().submit).toEqual([[payload]]);
    });

    it('should not submit if password validation failed', async () => {
      expect.assertions(1);

      const payload = {
        account: requestWithMessage.address,
        password: '123',
      };

      const spyon = jest.spyOn(Wallet.prototype, 'validatePassword');
      spyon.mockResolvedValueOnce(false);

      wrapper = wrapperFactory({
        request: requestWithMessage,
        isFormValid: true,
      });
      wrapper.setData({
        password: payload.password,
      });
      await wrapper.vm.$nextTick();

      wrapper.find('[data-test=submit-button]').vm.$emit('click');

      expect(wrapper.emitted().submit).toBeUndefined();
    });

    it('should not submit if isFormValid property is falsy', async () => {
      expect.assertions(1);

      const payload = {
        account: requestWithMessage.address,
        password: '123',
      };

      const spyon = jest.spyOn(Wallet.prototype, 'validatePassword');
      spyon.mockResolvedValueOnce(false);

      wrapper = wrapperFactory({
        request: requestWithMessage,
        isFormValid: false,
      });
      wrapper.setData({
        password: payload.password,
      });
      await wrapper.vm.$nextTick();

      wrapper.find('[data-test=submit-button]').vm.$emit('click');

      expect(wrapper.emitted().submit).toBeUndefined();
    });
  });
});
