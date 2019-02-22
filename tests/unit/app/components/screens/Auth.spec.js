import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Auth from '@/components/screens/Auth.vue';
import { IDENTITY_MODE } from '@/constants';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

describe('Auth', () => {
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
      },
      getters: {
        isDialog: jest.fn(() => true),
      },
    };
    accountsModule = {
      state: {
        linkSent: false,
        accounts: null,
        isAuthorized: false,
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
    };
    storeData = {
      modules: {
        accounts: accountsModule,
        core: coreModule,
      },
    };
    store = new Vuex.Store(storeData);
    wrapper = shallowMount(Auth, {
      localVue,
      store,
      router,
    });
  });

  describe('render', () => {
    it('should correctly render Auth component', () => {
      expect(wrapper.name()).toBe('Auth');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render create account form if user authorized but does not have any account', () => {
      store.state.accounts.isAuthorized = true;
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
    describe('initial actions', () => {
      // TODO: another magic moment
      //       it('should not do anything if it opened not in dialog', async () => {
      //         expect.assertions(3);
      //
      //         coreModule.getters.isDialog.mockReturnValueOnce(false);
      //         store = new Vuex.Store(storeData);
      //         wrapper = shallowMount(Auth, {
      //           localVue,
      //           store,
      //         });
      //
      //         await global.flushPromises();
      //
      //         expect(coreModule.actions.init).toBeCalled();
      //         expect(accountsModule.actions.awaitAuthMessage).not.toBeCalled();
      //         expect(coreModule.actions.sendReadyMessage).not.toBeCalled();
      //       });
    });

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

    it('should confirm auth if link was sent and authorization status was changed', () => {
      store.state.accounts.linkSent = true;
      store.state.accounts.accounts = ['0x0'];
      store.state.accounts.isAuthorized = true;

      expect(accountsModule.actions.confirmAuth).toBeCalled();
    });

    it('should cancel auth on form cancel', () => {
      // TODO Have troubles with triggering event from stub, solve it when possivble
      wrapper.vm.handleAuthCancel();

      expect(accountsModule.actions.cancelAuth).toBeCalled();
    });

    describe('create account form logic', () => {
      it('should open create account page on request event handling', () => {
        wrapper.vm.handleAccountRequest();

        expect(coreModule.actions.openCreateAccountPage).toBeCalled();
      });
    });

    describe('auth form logic', () => {
      it('should request auth on form submit', () => {
        // TODO Have troubles with triggering event from stub, solve it when possivble
        const params = {
          email: 'foo@bar.baz',
          serverMode: {
            type: IDENTITY_MODE.DEFAULT,
          },
        };

        wrapper.vm.handleAuthSubmit(params);

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

          expect(accountsModule.actions.getRecoveryIdentifier).toHaveBeenCalledTimes(1);
          expect(accountsModule.actions.getRecoveryIdentifier).toHaveBeenCalledWith(
            expect.any(Object), undefined, undefined
          );
          expect(wrapper.vm.recoverAccess).toBe(true);
        });

        it('should handle errors', async () => {
          expect.assertions(3);

          const error = new Error('error message');

          accountsModule.actions.getRecoveryIdentifier.mockRejectedValue(error);
          global.console.error = jest.fn();

          wrapper.find('otp-form-stub').vm.$emit('recover');

          await wrapper.vm.$nextTick();

          expect(accountsModule.actions.getRecoveryIdentifier).toHaveBeenCalledTimes(1);
          expect(accountsModule.actions.getRecoveryIdentifier).toHaveBeenCalledWith(
            expect.any(Object), undefined, undefined
          );
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
