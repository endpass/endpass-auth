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
        isAuthorized: true,
      },
      actions: {
        authWithHydra: jest.fn(),
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

      expect(wrapper.vm.error).not.toBeNull();
      expect($router.replace).not.toBeCalled();
    });

    it('should takes query params from current location and makes redirect if challengeId is not empty but authorization status is falsy', () => {
      accountsModule.state.isAuthorized = false;
      wrapper = shallowMount(LoginProvider, {
        localVue,
        store,
        mocks: {
          $router,
        },
      });

      expect($router.replace).toBeCalled();
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

    describe('password submit', () => {
      const password = 'foo';
      const challengeId = 'bar';

      it('should handle password submit and makes hydra login', async () => {
        expect.assertions(2);

        accountsModule.actions.authWithHydra.mockResolvedValueOnce({
          redirect: 'new/path',
        });

        wrapper.setData({
          queryParamsMap: {
            login_challenge: challengeId,
          },
        });
        wrapper.find('password-form-stub').vm.$emit('submit', password);

        expect(accountsModule.actions.authWithHydra).toBeCalledWith(
          expect.any(Object),
          {
            password,
            challengeId,
          },
          undefined,
        );

        await wrapper.vm.$nextTick();

        expect(window.location.href).toBe('new/path');
      });

      it('should render error if submit failed', async () => {
        expect.assertions(1);

        const errorMessage = 'ivyweed perturbing Laparosticti';
        const error = new Error(errorMessage);

        accountsModule.actions.authWithHydra.mockRejectedValueOnce(error);
        wrapper.setData({
          queryParamsMap: {
            challengeId,
          },
        });
        wrapper.find('password-form-stub').vm.$emit('submit', password);

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.error).toBe(errorMessage);
      });
    });
  });
});
