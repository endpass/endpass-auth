import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ConnectError from '@endpass/connect/error';
import Auth from '@/components/screens/Auth';
import setupI18n from '@/locales/i18nSetup';
import { authChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { METHODS } from '@/constants';

const localVue = createLocalVue();

const { ERRORS } = ConnectError;

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('Auth', () => {
  let wrapper;
  let accountsStore;
  let authStore;
  let $router;
  let $route;

  const createWrapper = options => {
    const store = createStore();
    const {
      accountsStore: accountsStoreModule,
      authStore: authStoreModule,
      coreStore,
    } = createStoreModules(store);

    accountsStore = accountsStoreModule;
    authStore = authStoreModule;

    $router = {
      replace: jest.fn().mockResolvedValue(),
    };
    $route = {
      query: {
        redirectUrl: 'http://foo.bar',
      },
      params: {},
    };

    return shallowMount(Auth, {
      accountsStore,
      authStore,
      coreStore,
      localVue,
      i18n,
      mocks: {
        $route,
        $router,
      },
      ...options,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render Auth screen component', () => {
      expect(wrapper.find('loading-screen-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should confirm auth on auth form authorize event handling', async () => {
      expect.assertions(1);

      const dataPromise = authChannel.take();
      const serverMode = {
        foo: 'bar',
      };

      wrapper = createWrapper({
        mocks: {
          $route: {
            query: {
              redirectUrl: 'http://localhost/public/foo/bar',
            },
            params: {
              isAuthSuccess: true,
              serverMode,
            },
          },
          $router,
        },
      });

      await global.flushPromises();
      const res = await dataPromise;

      expect(res).toEqual(Answer.createOk(serverMode));
    });

    it('should cancel auth', async () => {
      expect.assertions(2);

      const dataPromise = authChannel.take();

      wrapper = createWrapper({
        mocks: {
          $route: {
            query: {
              redirectUrl: 'http://localhost/public/foo/bar',
            },
            params: {
              isAuthCancel: true,
            },
          },
          $router,
        },
      });

      await global.flushPromises();
      const res = await dataPromise;

      expect(res).toEqual(
        Answer.createFail(
          ERRORS.AUTH_CANCELED_BY_USER,
          i18n.t('store.auth.authCanceled'),
        ),
      );
      expect(bridgeMessenger.send).toBeCalledWith(METHODS.DIALOG_CLOSE);
    });
  });
});
