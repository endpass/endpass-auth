import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import OtpBlock from '@/components/formsComposite/CompositeAuth/OtpBlock';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);
const i18n = setupI18n(localVue);

describe('OtpBlock', () => {
  let store;
  let storeData;
  let wrapper;
  let accountsModule;
  let coreModule;
  const router = new VueRouter();

  beforeEach(() => {
    jest.clearAllMocks();

    coreModule = {
      state: {
        loading: false,
      },
    };
    accountsModule = {
      state: {
        otpEmail: null,
      },
      actions: {
        confirmAuthViaOtp: jest.fn(),
        getRecoveryIdentifier: jest.fn(),
        recover: jest.fn(),
      },
    };
    storeData = {
      modules: {
        accounts: accountsModule,
        core: coreModule,
      },
    };
    store = new Vuex.Store(storeData);
    wrapper = shallowMount(OtpBlock, {
      localVue,
      store,
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

      await wrapper.vm.$nextTick();

      expect(wrapper.find('recover-form-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    describe('otp form', () => {
      describe('recover event', () => {
        beforeEach(() => {
          store.state.accounts.otpEmail = 'foo@bar.baz';
        });

        it('should handle recover event', async () => {
          expect.assertions(3);

          wrapper.find('otp-form-stub').vm.$emit('recover');

          await wrapper.vm.$nextTick();

          expect(
            accountsModule.actions.getRecoveryIdentifier,
          ).toHaveBeenCalledTimes(1);
          expect(
            accountsModule.actions.getRecoveryIdentifier,
          ).toHaveBeenCalledWith(expect.any(Object), undefined, undefined);
          expect(wrapper.vm.showOtp).toBe(false);
        });

        it('should handle errors', async () => {
          expect.assertions(3);

          const error = new Error('error message');

          accountsModule.actions.getRecoveryIdentifier.mockRejectedValue(error);
          global.console.error = jest.fn();

          wrapper.find('otp-form-stub').vm.$emit('recover');

          await wrapper.vm.$nextTick();

          expect(
            accountsModule.actions.getRecoveryIdentifier,
          ).toHaveBeenCalledTimes(1);
          expect(
            accountsModule.actions.getRecoveryIdentifier,
          ).toHaveBeenCalledWith(expect.any(Object), undefined, undefined);
          expect(wrapper.vm.error).toBe(error.message);
        });
      });
    });

    describe('recover form', () => {
      describe('submit event', () => {
        const seedPhrase = 'foo bar foo bar foo bar foo bar foo bar foo bar';

        beforeEach(() => {
          store.state.accounts.otpEmail = 'foo@bar.baz';

          wrapper.setData({
            showOtp: false,
          });
        });

        it('should handle recover event', async () => {
          expect.assertions(2);

          wrapper.find('recover-form-stub').vm.$emit('submit', seedPhrase);

          await wrapper.vm.$nextTick();

          expect(accountsModule.actions.recover).toHaveBeenCalledTimes(1);
          expect(accountsModule.actions.recover).toHaveBeenCalledWith(
            expect.any(Object),
            {
              seedPhrase,
            },
            undefined,
          );
        });

        it('should handle errors', async () => {
          expect.assertions(3);

          const error = new Error('error message');

          accountsModule.actions.recover.mockRejectedValue(error);
          global.console.error = jest.fn();

          wrapper.find('recover-form-stub').vm.$emit('submit', seedPhrase);

          await wrapper.vm.$nextTick();

          expect(accountsModule.actions.recover).toHaveBeenCalledTimes(1);
          expect(accountsModule.actions.recover).toHaveBeenCalledWith(
            expect.any(Object),
            {
              seedPhrase,
            },
            undefined,
          );
          expect(wrapper.vm.error).toBe(error.message);
        });
      });
    });
  });
});
