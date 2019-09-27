import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import OtpBlock from '@/components/formsComposite/CompositeAuth/OtpBlock';
import setupI18n from '@/locales/i18nSetup';
import identityService from '@/service/identity';
import createStore from '@/store/createStore';
import createStores from '@/store/createStores';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);
const i18n = setupI18n(localVue);

describe('OtpBlock', () => {
  let wrapper;
  const router = new VueRouter();
  let accountsStore;

  beforeEach(() => {
    jest.clearAllMocks();

    const store = createStore();
    const { accountsStore: accountsStoreModule, coreStore } = createStores(
      store,
    );
    accountsStore = accountsStoreModule;
    wrapper = shallowMount(OtpBlock, {
      accountsStore,
      coreStore,
      localVue,
      i18n,
      router,
    });
  });

  describe('render', () => {
    it('should correctly render OtpBlock component', () => {
      expect(wrapper.name()).toBe('OtpBlockForm');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render opt form', () => {
      expect(wrapper.find('otp-form-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render recover form', async () => {
      expect.assertions(2);

      wrapper.find('otp-form-stub').vm.$emit('recover');

      await global.flushPromises();

      expect(wrapper.find('recover-form-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    describe('otp form', () => {
      describe('recover event', () => {
        it('should handle recover event', async () => {
          expect.assertions(1);

          const identifier = 'identifier';

          identityService.getRecoveryIdentifier.mockResolvedValueOnce(
            identifier,
          );

          wrapper.find('otp-form-stub').vm.$emit('recover');

          await global.flushPromises();

          expect(wrapper.find('recover-form-stub').exists()).toBe(true);
        });

        it('should handle errors', async () => {
          expect.assertions(1);

          const error = new Error('error message');

          identityService.getRecoveryIdentifier.mockRejectedValueOnce(error);

          global.console.error = jest.fn();

          wrapper.find('otp-form-stub').vm.$emit('recover');

          await global.flushPromises();

          expect(wrapper.vm.error).toBe(error.message);
        });
      });
    });

    describe('recover form', () => {
      describe('submit event', () => {
        const seedPhrase = 'foo bar foo bar foo bar foo bar foo bar foo bar';

        beforeEach(() => {
          wrapper.setData({
            showOtp: false,
          });
        });

        it('should handle recover event', async () => {
          expect.assertions(3);

          accountsStore.setAuthParams({
            redirectUrl: 'redirectUrl',
          });

          wrapper.find('recover-form-stub').vm.$emit('submit', seedPhrase);

          await global.flushPromises();

          expect(wrapper.emitted().recover).toBeTruthy();
          expect(identityService.recover).toHaveBeenCalledTimes(1);
          expect(identityService.recover).toHaveBeenCalledWith(
            null,
            undefined,
            'redirectUrl',
          );
        });

        it('should handle errors', async () => {
          expect.assertions(1);

          const error = new Error('error message');

          identityService.recover.mockRejectedValue(error);
          global.console.error = jest.fn();

          wrapper.find('recover-form-stub').vm.$emit('submit', seedPhrase);

          await global.flushPromises();

          expect(wrapper.vm.error).toBe(error.message);
        });
      });
    });
  });
});
