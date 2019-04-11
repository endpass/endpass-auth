import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ConsentProvider from '@/components/screens/ConsentProvider';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('ConsentProvider', () => {
  let $router;
  let wrapper;
  let store;
  let storeData;
  let coreModule;
  let accountsModule;

  beforeEach(() => {
    jest.clearAllMocks();

    coreModule = {
      state: {
        loading: false,
      },
    };
    accountsModule = {
      state: {
        isAuthorized: true,
      },
      actions: {
        grantPermissionsWithHydra: jest.fn(),
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
        $router,
      },
    });
  });

  describe('render', () => {
    it('should correctly render ConsentProvider screen', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should takes query params from current location and assign error if consentChallenge is not in params', () => {
      $router.history.current.query = {};

      wrapper = shallowMount(ConsentProvider, {
        localVue,
        store,
        mocks: {
          $router,
        },
      });

      expect(wrapper.vm.error).not.toBeNull();
      expect($router.replace).not.toBeCalled();
    });

    it('should takes query params from current location and assign error if scopes is not in params', () => {
      $router.history.current.query = {
        consent_challenge: 'foo',
      };
      wrapper = shallowMount(ConsentProvider, {
        localVue,
        store,
        mocks: {
          $router,
        },
      });

      expect(wrapper.vm.error).not.toBeNull();
      expect($router.replace).not.toBeCalled();
    });

    it('should takes query params from current location and makes redirect if consentChallenge is not empty but authorization status is falsy', () => {
      accountsModule.state.isAuthorized = false;
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

      expect(wrapper.vm.error).toBeNull();
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

      wrapper
        .find('scopes-form-stub')
        .vm.$emit('submit', ['foo', 'bar', 'baz']);

      expect(accountsModule.actions.grantPermissionsWithHydra).toBeCalledWith(
        expect.any(Object),
        {
          consentChallenge: 'foo',
          scopes: ['foo', 'bar', 'baz'],
        },
        undefined,
      );
    });

    it('should not grant permissions on scopes form submit if consentChallenge is not in params', () => {
      wrapper.setData({
        params: {
          consent_challenge: null,
        },
      });

      wrapper.find('scopes-form-stub').vm.$emit('submit');

      expect(accountsModule.actions.grantPermissionsWithHydra).not.toBeCalled();
    });
  });
});
