import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import CompositeAuth from '@/components/forms/CompositeAuth.vue';
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
        inited: true,
        loading: false,
      },
      actions: {
        openCreateAccountPage: jest.fn(),
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
        confirmAuth: jest.fn(),
        awaitAuthConfirm: jest.fn(),
        awaitAccountCreate: jest.fn(),
        awaitAuthMessage: jest.fn(),
        getRecoveryIdentifier: jest.fn(),
        recover: jest.fn(),
      },
      getters: {
        isAuthorized: jest.fn(
          () =>
            accountsModule.state.isLogin && accountsModule.state.isPermission,
        ),
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

    it('should render create account form if user authorized but does not have any account', () => {
      store.state.accounts.isLogin = true;
      store.state.accounts.isPermission = true;
      store.state.accounts.accounts = [];

      expect(wrapper.find('create-account-form-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render opt form', () => {
      store.state.accounts.otpEmail = 'foo@bar.baz';

      wrapper.setData({
        recoverAccess: false,
      });

      expect(wrapper.find('otp-form-stub').exists()).toBe(true);
    });

    it('should render recovery form', () => {
      store.state.accounts.otpEmail = 'foo@bar.baz';
      store.state.accounts.linkSent = false;

      wrapper.setData({
        recoverAccess: true,
      });

      expect(wrapper.find('recover-form-stub').exists()).toBe(true);
    });

    it('should render message form if link sent but user is not authorized', () => {
      store.state.accounts.linkSent = true;
      store.state.accounts.accounts = null;

      expect(wrapper.find('message-form-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render auth form in other cases', () => {
      expect(wrapper.find('auth-form-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should not confirm auth by default on mount', () => {
      expect(accountsModule.actions.confirmAuth).not.toBeCalled();
    });

    it('should not confirm auth if link was sent but authorization status was not changed', () => {
      store.state.accounts.linkSent = true;

      expect(accountsModule.actions.confirmAuth).not.toBeCalled();
    });

    it('should not confirm auth if link was sent and authorization status was changed but account are empty', () => {
      store.state.accounts.linkSent = true;
      store.state.accounts.accounts = [];

      expect(accountsModule.actions.confirmAuth).not.toBeCalled();
    });

    it('should emit authorize event if link was sent and authorization status was changed', () => {
      store.state.accounts.linkSent = true;
      store.state.accounts.accounts = ['0x0'];
      store.state.accounts.isLogin = true;
      store.state.accounts.isPermission = true;

      expect(wrapper.emitted().authorize[0]).toEqual([{ serverMode: null }]);
    });

    it('should cancel auth on form cancel', async () => {
      expect.assertions(1);

      accountsModule.state.linkSent = true;
      wrapper = shallowMount(CompositeAuth, {
        localVue,
        store,
        router,
      });

      wrapper.find('message-form-stub').vm.$emit('cancel');

      await wrapper.vm.$nextTick();

      expect(accountsModule.actions.cancelAuth).toBeCalled();
    });

    describe('create account form logic', () => {
      it('should open create account page on request event handling', () => {
        wrapper.vm.handleAccountRequest();

        expect(coreModule.actions.openCreateAccountPage).toBeCalled();
      });
    });

    describe('auth form logic', () => {
      it('should request auth on form submit', async () => {
        expect.assertions(2);

        const params = {
          email: 'foo@bar.baz',
          serverMode: {
            type: IDENTITY_MODE.DEFAULT,
          },
        };

        wrapper.find('auth-form-stub').vm.$emit('submit', params);

        await wrapper.vm.$nextTick();

        expect(accountsModule.actions.auth).toBeCalledTimes(1);
        expect(accountsModule.actions.auth).toBeCalledWith(
          expect.any(Object),
          params,
          undefined,
        );
      });
    });

    describe('otp form', () => {
      describe('recover event', () => {
        beforeEach(() => {
          store.state.accounts.otpEmail = 'foo@bar.baz';

          wrapper.setData({
            recoverAccess: false,
          });
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
          expect(wrapper.vm.recoverAccess).toBe(true);
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
            recoverAccess: true,
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
