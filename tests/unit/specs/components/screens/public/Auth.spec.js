import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Auth from '@/components/screens/public/Auth.vue';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();

const i18n = setupI18n(localVue);
localVue.use(Vuex);

describe('PublicAuth', () => {
  let wrapper;
  let $router;
  let $route;
  let store;
  let storeData;
  let accountsModule;

  beforeEach(() => {
    jest.clearAllMocks();

    $router = {
      replace: jest.fn(),
    };
    accountsModule = {
      mutations: {
        setAuthParams: jest.fn(),
      },
      actions: {
        checkAccountExists: jest.fn(),
        waitAccountCreate: jest.fn(),
      },
    };
    storeData = {
      modules: {
        accounts: accountsModule,
      },
    };
    store = new Vuex.Store(storeData);
    $route = {
      query: {
        redirectUrl: 'http://foo.bar',
      },
    };
    wrapper = shallowMount(Auth, {
      localVue,
      mocks: {
        $route,
        $router,
      },
      store,
      i18n,
    });
  });

  describe('render', () => {
    it('should correctly render Auth public screen component', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should redirect to LoginProvider on auth form authorize event handling', async () => {
      expect.assertions(1);

      wrapper.setData({
        queryParamsMap: {
          redirectUrl: 'http://localhost/public/foo/bar',
        },
      });
      wrapper.vm.checkAccountExists = jest
        .fn()
        .mockImplementationOnce(async () => true);

      wrapper.find('composite-auth-form-stub').vm.$emit('authorize');
      await global.flushPromises();

      expect(wrapper.vm.$router.replace).toBeCalledWith('/public/foo/bar');
    });

    it('should set auth params if redirectUrl exists', () => {
      expect(accountsModule.mutations.setAuthParams).toBeCalledWith(
        expect.any(Object),
        {
          redirectUrl: 'http://foo.bar',
        },
      );
    });

    it('should not set auth params if redirectUrl not exists', () => {
      accountsModule.mutations.setAuthParams.mockRestore();
      wrapper = shallowMount(Auth, {
        localVue,
        mocks: {
          $route: {
            query: {},
          },
          $router,
        },
        store,
        i18n,
      });

      expect(accountsModule.mutations.setAuthParams).not.toBeCalled();
    });
  });
});
