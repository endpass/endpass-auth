import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Auth from '@/components/screens/public/Auth';
import setupI18n from '@/locales/i18nSetup';
import identityService from '@/service/identity';
import createStores from '@/store/createStores';
import createStore from '@/store/createStore';

const localVue = createLocalVue();

const i18n = setupI18n(localVue);
localVue.use(Vuex);

describe('PublicAuth', () => {
  let wrapper;
  let $router;
  let $route;
  let accountsStore;

  const createWrapper = options => {
    const store = createStore();
    const { accountsStore: accountsStoreModule, coreStore } = createStores(
      store,
    );
    accountsStore = accountsStoreModule;

    return shallowMount(Auth, {
      accountsStore,
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
      replace: jest.fn(),
    };
    $route = {
      query: {
        redirectUrl: 'http://foo.bar',
      },
    };
  });

  describe('render', () => {
    it('should correctly render Auth public screen component', () => {
      wrapper = createWrapper();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should redirect to LoginProvider on auth form authorize event handling', async () => {
      expect.assertions(1);

      wrapper = createWrapper();
      wrapper.setData({
        queryParamsMap: {
          redirectUrl: 'http://localhost/public/foo/bar',
        },
      });

      identityService.checkAccountExist.mockResolvedValueOnce(true);

      wrapper.find('composite-auth-form-stub').vm.$emit('authorize');
      await global.flushPromises();

      expect(wrapper.vm.$router.replace).toBeCalledWith('/public/foo/bar');
    });

    it('should set auth params if redirectUrl exists', () => {
      const redirectUrl = 'http://my.redirect.url';
      wrapper = createWrapper({
        mocks: {
          $route: {
            query: {
              redirectUrl,
            },
          },
          $router,
        },
      });

      expect(accountsStore.authParams).toEqual({
        redirectUrl,
      });
    });

    it('should not set auth params if redirectUrl not exists', () => {
      wrapper = createWrapper({
        mocks: {
          $route: {
            query: {},
          },
          $router,
        },
      });

      expect(accountsStore.authParams).toBe(null);
    });
  });
});
