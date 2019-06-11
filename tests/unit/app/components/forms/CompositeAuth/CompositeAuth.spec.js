import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import CompositeAuth from '@/components/forms/CompositeAuth';
import { IDENTITY_MODE } from '@/constants';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

describe('CompositeAuth', () => {
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
        isInited: true,
        loading: false,
        isIdentityMode: false,
      },
      actions: {
        dialogClose: jest.fn(),
      },
      getters: {
        isDialog: jest.fn(() => true),
      },
    };
    accountsModule = {
      state: {
        linkSent: false,
        accounts: null,
        isLogin: false,
        isPermission: false,
        otpEmail: null,
      },
      actions: {
        auth: jest.fn(),
        cancelAuth: jest.fn(),
        waitLogin: jest.fn(),
      },
    };
    storeData = {
      modules: {
        accounts: accountsModule,
        core: coreModule,
      },
    };
    store = new Vuex.Store(storeData);
    wrapper = shallowMount(CompositeAuth, {
      localVue,
      store,
      router,
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
      expect.assertions(3);

      wrapper.find('auth-form-stub').vm.$emit('submit', {
        email: 'email',
        serverMode: { type: IDENTITY_MODE.CUSTOM },
      });

      await global.flushPromises();

      expect(accountsModule.actions.auth).not.toBeCalled();
      expect(accountsModule.actions.waitLogin).not.toBeCalled();
      expect(wrapper.emitted().authorize[0]).toEqual([
        { serverMode: { type: 'custom' } },
      ]);
    });

    it('should show message after submit if not otp', async () => {
      expect.assertions(5);

      wrapper.find('auth-form-stub').vm.$emit('submit', authParams);

      await global.flushPromises();

      expect(wrapper.find('message-form-stub').exists()).toBe(true);

      expect(accountsModule.actions.auth).toBeCalledTimes(1);
      expect(accountsModule.actions.auth).toBeCalledWith(
        expect.any(Object),
        authParams,
        undefined,
      );
      expect(accountsModule.actions.waitLogin).toBeCalledTimes(1);
      expect(wrapper.emitted().authorize[0]).toEqual([
        { serverMode: authParams.serverMode },
      ]);
    });

    describe('otp behavior', () => {
      it('should show otp block after submit', async () => {
        expect.assertions(5);

        store.state.accounts.otpEmail = authParams.email;

        wrapper.find('auth-form-stub').vm.$emit('submit', authParams);

        await global.flushPromises();

        expect(wrapper.find('otp-block-form-stub').exists()).toBe(true);

        expect(accountsModule.actions.auth).toBeCalledTimes(1);
        expect(accountsModule.actions.auth).toBeCalledWith(
          expect.any(Object),
          authParams,
          undefined,
        );
        expect(wrapper.emitted().authorize).toBeFalsy();
        expect(accountsModule.actions.waitLogin).not.toBeCalled();
      });

      it('should submit otp', async () => {
        expect.assertions(3);

        store.state.accounts.otpEmail = authParams.email;

        wrapper.find('auth-form-stub').vm.$emit('submit', authParams);
        await global.flushPromises();
        wrapper.find('otp-block-form-stub').vm.$emit('submit');
        await global.flushPromises();

        expect(wrapper.find('otp-block-form-stub').exists()).toBe(true);

        expect(accountsModule.actions.waitLogin).toBeCalledTimes(1);
        expect(wrapper.emitted().authorize[0]).toEqual([
          { serverMode: authParams.serverMode },
        ]);
      });

      it('should recover otp', async () => {
        expect.assertions(3);

        store.state.accounts.otpEmail = authParams.email;

        wrapper.find('auth-form-stub').vm.$emit('submit', authParams);
        await global.flushPromises();
        wrapper.find('otp-block-form-stub').vm.$emit('recover');
        await global.flushPromises();

        expect(wrapper.find('message-form-stub').exists()).toBe(true);

        expect(accountsModule.actions.waitLogin).toBeCalledTimes(1);
        expect(wrapper.emitted().authorize[0]).toEqual([
          { serverMode: authParams.serverMode },
        ]);
      });
    });

    it('should cancel auth', async () => {
      expect.assertions(2);

      wrapper.find('auth-form-stub').vm.$emit('submit', authParams);

      await global.flushPromises();

      wrapper.find('message-form-stub').vm.$emit('cancel');

      expect(accountsModule.actions.cancelAuth).toBeCalled();
      expect(coreModule.actions.dialogClose).toBeCalled();
    });
  });
});
