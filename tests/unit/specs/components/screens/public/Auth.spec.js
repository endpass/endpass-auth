import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Auth from '@/components/screens/public/Auth';
import setupI18n from '@/locales/i18nSetup';
import createStoreModules from '@/store/createStoreModules';
import createStore from '@/store/createStore';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { METHODS } from '@/constants';

const localVue = createLocalVue();

const i18n = setupI18n(localVue);
localVue.use(Vuex);

describe('PublicAuth', () => {
  let wrapper;
  let $router;
  let $route;
  let accountsStore;
  let authStore;

  const wrapperFactory = options => {
    const store = createStore();
    const {
      accountsStore: accountsStoreModule,
      authStore: authStoreModule,
      coreStore,
    } = createStoreModules(store);

    accountsStore = accountsStoreModule;
    authStore = authStoreModule;

    return shallowMount(Auth, {
      accountsStore,
      authStore,
      coreStore,
      localVue,
      mocks: {
        $route,
        $router,
      },
      i18n,
      ...options,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    $router = {
      replace: jest.fn().mockResolvedValue(),
    };
    $route = {
      query: {
        redirectUrl: 'http://foo.bar',
      },
      params: {},
    };

    wrapper = wrapperFactory();
  });

  describe('render', () => {
    it('should correctly render Auth public screen component', () => {
      expect(wrapper.find('loading-screen-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should redirect to LoginProvider on auth form authorize event handling', () => {
      expect.assertions(1);

      wrapper = wrapperFactory({
        mocks: {
          $route: {
            query: {
              redirectUrl: 'http://localhost/public/foo/bar',
            },
            params: {
              isAuthSuccess: true,
            },
          },
          $router,
        },
      });

      expect(wrapper.vm.$router.replace).toBeCalledWith('/public/foo/bar');
    });

    it('should set auth params if redirectUrl exists', () => {
      const redirectUrl = 'http://my.redirect.url';
      wrapper = wrapperFactory({
        mocks: {
          $route: {
            query: {
              redirectUrl,
            },
            params: {},
          },
          $router,
        },
      });

      expect(authStore.authParams).toEqual({
        redirectUrl,
      });
    });

    it('should not set auth params if redirectUrl not exists', () => {
      wrapper = wrapperFactory({
        mocks: {
          $route: {
            query: {},
            params: {},
          },
          $router,
        },
      });

      expect(authStore.authParams).toBe(null);
    });

    it('should cancel and close auth', () => {
      wrapper = wrapperFactory({
        mocks: {
          $route: {
            query: {},
            params: {
              isAuthCancel: true,
            },
          },
          $router,
        },
      });

      expect(bridgeMessenger.send).toBeCalledWith(METHODS.DIALOG_CLOSE);
    });
  });
});
