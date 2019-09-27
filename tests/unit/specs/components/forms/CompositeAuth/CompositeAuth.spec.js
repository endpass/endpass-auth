import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ConnectError from '@endpass/class/ConnectError';
import CompositeAuth from '@/components/formsComposite/CompositeAuth';
import { IDENTITY_MODE, METHODS } from '@/constants';
import setupI18n from '@/locales/i18nSetup';
import identityService from '@/service/identity';
import { authChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import createStore from '@/store/createStore';
import createStores from '@/store/createStores';

const localVue = createLocalVue();
const { ERRORS } = ConnectError;

const i18n = setupI18n(localVue);
localVue.use(Vuex);
localVue.use(VueRouter);

describe('CompositeAuth', () => {
  let wrapper;
  const router = new VueRouter();

  beforeEach(() => {
    jest.clearAllMocks();

    const store = createStore();
    const { accountsStore, coreStore } = createStores(store);

    wrapper = shallowMount(CompositeAuth, {
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

    it('should render opt form', () => {
      wrapper.setData({
        currentForm: 'OTP',
      });

      expect(wrapper.find('otp-block-form-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render message form', () => {
      wrapper.setData({
        currentForm: 'MESSAGE',
      });

      expect(wrapper.find('message-form-stub').exists()).toBe(true);
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

    it('should show message after submit if not otp', async () => {
      expect.assertions(5);

      identityService.auth.mockResolvedValueOnce({
        success: true,
        challenge: { challengeType: 'other' },
      });

      expect(wrapper.find('message-form-stub').exists()).toBe(false);
      expect(accountsStore.linkSent).toBe(false);

      wrapper.find('auth-form-stub').vm.$emit('submit', authParams);

      await global.flushPromises();

      expect(wrapper.find('message-form-stub').exists()).toBe(true);
      expect(accountsStore.linkSent).toBe(true);
      expect(wrapper.emitted().authorize[0]).toEqual([
        { serverMode: authParams.serverMode },
      ]);
    });

    describe('otp behavior', () => {
      it('should show otp block after submit', async () => {
        expect.assertions(2);

        identityService.auth.mockResolvedValueOnce({
          success: true,
          challenge: { challengeType: 'otp' },
        });

        wrapper.find('auth-form-stub').vm.$emit('submit', authParams);

        await global.flushPromises();

        expect(wrapper.find('otp-block-form-stub').exists()).toBe(true);

        expect(wrapper.emitted().authorize).toBeFalsy();
      });

      it('should submit otp', async () => {
        expect.assertions(3);

        identityService.auth.mockResolvedValueOnce({
          success: true,
          challenge: { challengeType: 'otp' },
        });

        wrapper.find('auth-form-stub').vm.$emit('submit', authParams);
        await global.flushPromises();
        wrapper.find('otp-block-form-stub').vm.$emit('submit');
        await global.flushPromises();

        expect(wrapper.find('otp-block-form-stub').exists()).toBe(true);

        expect(identityService.waitLogin).toBeCalledTimes(1);
        expect(wrapper.emitted().authorize[0]).toEqual([
          { serverMode: authParams.serverMode },
        ]);
      });

      it('should recover otp', async () => {
        expect.assertions(3);

        identityService.auth.mockResolvedValueOnce({
          success: true,
          challenge: { challengeType: 'otp' },
        });

        wrapper.find('auth-form-stub').vm.$emit('submit', authParams);
        await global.flushPromises();
        wrapper.find('otp-block-form-stub').vm.$emit('recover');
        await global.flushPromises();

        expect(wrapper.find('message-form-stub').exists()).toBe(true);
        expect(identityService.waitLogin).toBeCalledTimes(1);
        expect(wrapper.emitted().authorize[0]).toEqual([
          { serverMode: authParams.serverMode },
        ]);
      });
    });

    it('should cancel auth', async () => {
      expect.assertions(2);

      identityService.auth.mockResolvedValueOnce({
        success: true,
      });
      const dataPromise = authChannel.take();
      wrapper.find('auth-form-stub').vm.$emit('submit', authParams);
      await global.flushPromises();
      wrapper.find('message-form-stub').vm.$emit('cancel');
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
