import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import CompositeAuth from '@/components/forms/CompositeAuth';
import { IDENTITY_MODE } from '@/constants';
import setupI18n from '@/locales/i18nSetup';
import authService from '@/service/auth';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';

const localVue = createLocalVue();

const i18n = setupI18n(localVue);
localVue.use(Vuex);
localVue.use(VueRouter);

describe('CompositeAuth', () => {
  let wrapper;
  let accountsStore;
  let authStore;
  const router = new VueRouter();

  beforeEach(() => {
    jest.clearAllMocks();

    const store = createStore();
    const {
      authStore: authStoreModule,
      accountsStore: accountsStoreModule,
      coreStore,
    } = createStoreModules(store);

    accountsStore = accountsStoreModule;
    authStore = authStoreModule;

    wrapper = shallowMount(CompositeAuth, {
      authStore,
      accountsStore,
      coreStore,
      localVue,
      router,
      i18n,
    });
  });

  describe('render', () => {
    it('should correctly render CompositeAuth component', () => {
      expect(wrapper.name()).toBe('CompositeAuth');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render auth form by default', () => {
      expect(wrapper.find('auth-form-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    const authParams = {
      email: 'foo@bar.baz',
      serverMode: {
        type: IDENTITY_MODE.DEFAULT,
      },
    };

    describe('otp behavior', () => {
      it.skip('should show otp block after submit', async () => {
        // TODO: move to auth test
        expect.assertions(2);

        authService.getAuthChallenge.mockResolvedValueOnce({
          success: true,
          challenge: { challengeType: 'otp' },
        });

        wrapper.find('auth-form-stub').vm.$emit('submit', authParams);
        await global.flushPromises();

        expect(wrapper.find('code-form-stub').exists()).toBe(true);

        expect(wrapper.emitted().authorize).toBeFalsy();
      });

      it.skip('should submit otp', async () => {
        // TODO: move to otp tests
        expect.assertions(3);

        authService.getAuthChallenge.mockResolvedValueOnce({
          success: true,
          challenge: { challengeType: 'otp' },
        });

        wrapper
          .find('auth-form-stub')
          .vm.$emit('submit', { ...authParams, password: 'password' });
        await global.flushPromises();
        wrapper.find('code-form-stub').vm.$emit('submit');
        await global.flushPromises();

        expect(wrapper.find('code-form-stub').exists()).toBe(true);

        expect(authService.waitLogin).toBeCalledTimes(1);
        expect(wrapper.emitted().authorize[0]).toEqual([
          { serverMode: authParams.serverMode },
        ]);
      });
    });

    it('should cancel auth', () => {
      wrapper.find('auth-form-stub').vm.$emit('submit', authParams);
      wrapper.find('regular-password-form-stub').vm.$emit('cancel');

      expect(wrapper.emitted().cancel).toEqual([[]]);
    });
  });
});
