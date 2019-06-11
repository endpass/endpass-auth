import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import '@mocks/window';
import LoginProvider from '@/components/screens/public/LoginProvider';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('LoginProvider', () => {
  let $router;
  let wrapper;
  let store;
  let storeData;
  let coreModule;
  let accountsModule;

  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = jest.fn();

    coreModule = {
      state: {
        loading: false,
      },
    };
    accountsModule = {
      state: {
        isLogin: true,
        isPermission: true,
      },
      actions: {
        authWithOauth: jest.fn(),
        checkOauthLoginRequirements: jest.fn().mockResolvedValue({
          skip: false,
        }),
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
    $router = {
      history: {
        current: {
          query: {
            login_challenge: 'foo',
          },
        },
      },
      replace: jest.fn(),
    };
    wrapper = shallowMount(LoginProvider, {
      localVue,
      store,
      mocks: {
        $router,
      },
    });
  });

  describe('render', () => {
    it('should correctly render LoginProvider screen', () => {
      wrapper = shallowMount(LoginProvider, {
        localVue,
        store,
        mocks: {
          $router,
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('[data-test=error-message]').exists()).toBe(false);
    });
  });

  describe('behavior', () => {
    it('should takes query params from current location and assign error if challengeId is not in params', () => {
      $router.history.current.query = {};
      wrapper = shallowMount(LoginProvider, {
        localVue,
        store,
        mocks: {
          $router,
        },
      });

      expect(wrapper.find('sign-password-stub').exists()).toBe(false);
      expect($router.replace).not.toBeCalled();
    });

    it('should takes query params from current location and makes redirect if challengeId is not empty but authorization status is falsy', () => {
      accountsModule.state.isLogin = false;
      accountsModule.state.isPermission = false;

      wrapper = shallowMount(LoginProvider, {
        localVue,
        store,
        mocks: {
          $router,
        },
      });

      expect($router.replace).toBeCalled();
    });

    describe('should takes query params from current location and check hydra oauth skip status', () => {
      beforeEach(() => {
        window.location = {
          replace: jest.fn(),
        };
      });

      it('should do not anything if skip status is falsy', async () => {
        expect.assertions(1);

        wrapper = shallowMount(LoginProvider, {
          localVue,
          store,
          mocks: {
            $router,
          },
        });
        await global.flushPromises();

        expect(window.location.replace).not.toBeCalled();
      });

      it('should show error if check oauth if fault', async () => {
        expect.assertions(1);

        accountsModule.actions.checkOauthLoginRequirements.mockRejectedValueOnce(
          'error',
        );
        wrapper = shallowMount(LoginProvider, {
          localVue,
          store,
          mocks: {
            $router,
          },
        });
        await global.flushPromises();

        console.log(wrapper.html());

        expect(wrapper.find('[data-test=error-message]').exists()).toBe(true);
      });

      it('should make redirect if skip status is truthy on received redirect url', async () => {
        expect.assertions(1);

        const payload = {
          skip: true,
          redirect: 'http://foo.bar',
        };
        accountsModule.actions.checkOauthLoginRequirements.mockResolvedValueOnce(
          payload,
        );
        wrapper = shallowMount(LoginProvider, {
          localVue,
          store,
          mocks: {
            $router,
          },
        });
        await global.flushPromises();

        expect(window.location.replace).toBeCalledWith(payload.redirect);
      });
    });

    it('should not do anything on mounting if challengeId is present in query params and user authorized', () => {
      wrapper = shallowMount(LoginProvider, {
        localVue,
        store,
        mocks: {
          $router,
        },
      });

      expect(wrapper.vm.error).toBeNull();
      expect($router.replace).not.toBeCalled();
    });
  });
});
