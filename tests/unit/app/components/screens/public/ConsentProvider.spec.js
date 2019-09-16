import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ConsentProvider from '@/components/screens/public/ConsentProvider';
import '@mocks/window';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('ConsentProvider', () => {
  let $router;
  let $route;
  let wrapper;
  let store;
  let storeData;
  let coreModule;
  let accountsModule;

  function createRouter() {
    return {
      history: {
        current: {
          query: {
            consent_challenge: 'foo',
          },
        },
      },
      replace: jest.fn(),
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();

    coreModule = {
      state: {
        loading: false,
      },
      actions: {
        dialogClose: jest.fn(),
      },
    };
    accountsModule = {
      state: {
        isLogin: true,
      },
      actions: {
        getConsentDetails: jest.fn().mockResolvedValue({
          requested_scope: [],
        }),
        cancelAuth: jest.fn(),
        grantPermissionsWithOauth: jest.fn(),
      },
    };
    storeData = {
      modules: {
        accounts: accountsModule,
        core: coreModule,
      },
    };
    store = new Vuex.Store(storeData);
    $router = createRouter();
    $route = {
      query: {
        consent_challenge: 'foo',
        scopes: 'foo bar baz',
      },
    };
    wrapper = shallowMount(ConsentProvider, {
      localVue,
      store,
      i18n,
      mocks: {
        $router,
        $route,
      },
    });
  });

  describe('render', () => {
    it('should correctly render ConsentProvider screen', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should takes query params from current location and assign error if consentChallenge is not in params', async () => {
      $router = createRouter();
      $router.history.current.query = {};

      wrapper = shallowMount(ConsentProvider, {
        localVue,
        store,
        i18n,
        mocks: {
          $router,
          $route: {
            query: {},
          },
        },
      });

      expect(wrapper.vm.error.show).toBe(true);
      expect($router.replace).not.toBeCalled();
    });

    it('should should redirect if consent request provided skip', async () => {
      expect.assertions(1);

      // eslint-disable-next-line
      const redirect_url = 'http://kek.kek';
      accountsModule.actions.getConsentDetails.mockResolvedValue({
        skip: true,
        requested_scope: [],
        redirect_url,
      });
      $router = createRouter();
      wrapper = shallowMount(ConsentProvider, {
        localVue,
        store,
        i18n,
        mocks: {
          $router,
          $route,
        },
      });
      await wrapper.vm.$nextTick();
      expect(window.location.href).toBe(redirect_url);
    });

    it('should takes query params from current location and makes redirect if consentChallenge is not empty but authorization status is falsy', () => {
      $router = createRouter();
      accountsModule.state.isLogin = false;
      wrapper = shallowMount(ConsentProvider, {
        localVue,
        store,
        i18n,
        mocks: {
          $router,
          $route,
        },
      });

      expect($router.replace).toBeCalled();
    });

    it('should not do anything on mounting if challengeId is present in query params and user authorized', () => {
      wrapper = shallowMount(ConsentProvider, {
        localVue,
        store,
        i18n,
        mocks: {
          $router,
          $route,
        },
      });

      expect(wrapper.vm.error).toEqual({
        show: false,
        hint: '',
        description: '',
      });
      expect($router.replace).not.toBeCalled();
    });

    it('should grant permissions on scopes form submit', () => {
      wrapper = shallowMount(ConsentProvider, {
        localVue,
        store,
        i18n,
        mocks: {
          $router,
          $route,
        },
      });
      wrapper.setData({
        scopesList: ['foo', 'bar', 'baz'],
        isLoading: false,
      });

      wrapper
        .find('scopes-form-stub')
        .vm.$emit('submit', ['foo', 'bar', 'baz']);

      expect(accountsModule.actions.grantPermissionsWithOauth).toBeCalledWith(
        expect.any(Object),
        {
          consentChallenge: 'foo',
          scopesList: ['foo', 'bar', 'baz'],
        },
        undefined,
      );
    });

    it('should cancel auth and close window on scope cancel', async () => {
      wrapper = shallowMount(ConsentProvider, {
        localVue,
        store,
        i18n,
        mocks: {
          $router,
          $route,
        },
      });
      const spy = jest.spyOn(wrapper.vm, 'handleAuthCancel');
      wrapper.setData({
        scopesList: ['foo', 'bar', 'baz'],
        isLoading: false,
      });
      wrapper.find('scopes-form-stub').vm.$emit('cancel');

      expect(spy).toHaveBeenCalled();
    });
  });
});
