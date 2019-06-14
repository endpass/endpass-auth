import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ConsentProvider from '@/components/screens/public/ConsentProvider';
import '@mocks/window';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('ConsentProvider', () => {
  let $router;
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
    };
    accountsModule = {
      state: {
        isLogin: true,
      },
      actions: {
        getConsentDetails: jest.fn().mockResolvedValue({
          requested_scope: [],
        }),
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
    $router = {
      history: {
        current: {
          query: {
            consent_challenge: 'foo',
            scopes: 'foo bar baz',
          },
        },
      },
      replace: jest.fn(),
    };
    wrapper = shallowMount(ConsentProvider, {
      localVue,
      store,
      mocks: {
        $router: createRouter(),
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
        mocks: {
          $router,
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
        mocks: {
          $router,
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
        mocks: {
          $router,
        },
      });

      expect($router.replace).toBeCalled();
    });

    it('should not do anything on mounting if challengeId is present in query params and user authorized', () => {
      wrapper = shallowMount(ConsentProvider, {
        localVue,
        store,
        mocks: {
          $router,
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
        mocks: {
          $router,
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
  });
});
