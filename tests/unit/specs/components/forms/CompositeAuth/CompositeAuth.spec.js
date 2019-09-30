import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ConnectError from '@endpass/class/ConnectError';
import CompositeAuth from '@/components/forms/CompositeAuth';
import { IDENTITY_MODE, METHODS } from '@/constants';
import setupI18n from '@/locales/i18nSetup';
import identityService from '@/service/identity';
import { authChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';

const localVue = createLocalVue();
const { ERRORS } = ConnectError;

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

    it('should not call auth if mode is not default', async () => {
      expect.assertions(2);

      wrapper.find('auth-form-stub').vm.$emit('submit', {
        email: 'email',
        serverMode: { type: IDENTITY_MODE.CUSTOM },
      });

      await global.flushPromises();

      expect(identityService.auth).not.toBeCalled();

      expect(wrapper.emitted().authorize[0]).toEqual([
        { serverMode: { type: 'custom' } },
      ]);
    });

    describe('otp behavior', () => {
      it('should show otp block after submit', async () => {
        expect.assertions(2);

        identityService.getAuthChallenge.mockResolvedValueOnce({
          success: true,
          challenge: { challengeType: 'otp' },
        });

        wrapper.find('auth-form-stub').vm.$emit('submit', authParams);
        await global.flushPromises();

        expect(wrapper.find('code-form-stub').exists()).toBe(true);

        expect(wrapper.emitted().authorize).toBeFalsy();
      });

      it('should submit otp', async () => {
        expect.assertions(3);

        identityService.getAuthChallenge.mockResolvedValueOnce({
          success: true,
          challenge: { challengeType: 'otp' },
        });

        wrapper.find('auth-form-stub').vm.$emit('submit', authParams);
        await global.flushPromises();
        wrapper.find('code-form-stub').vm.$emit('submit');
        await global.flushPromises();

        expect(wrapper.find('code-form-stub').exists()).toBe(true);

        expect(identityService.waitLogin).toBeCalledTimes(1);
        expect(wrapper.emitted().authorize[0]).toEqual([
          { serverMode: authParams.serverMode },
        ]);
      });
    });

    it('should cancel auth', async () => {
      expect.assertions(2);

      identityService.getAuthChallenge.mockResolvedValueOnce({
        success: true,
      });
      const dataPromise = authChannel.take();
      wrapper.find('auth-form-stub').vm.$emit('submit', authParams);
      await global.flushPromises();
      wrapper.find('code-form-stub').vm.$emit('cancel');
      const res = await dataPromise;

      expect(res).toEqual(
        Answer.createFail(
          ERRORS.AUTH_CANCELED_BY_USER,
          'Authentication was canceled by user!',
        ),
      );

      expect(bridgeMessenger.send).toBeCalledWith(METHODS.DIALOG_CLOSE);
    });
  });
});
