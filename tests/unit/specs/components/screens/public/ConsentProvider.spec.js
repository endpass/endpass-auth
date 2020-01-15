import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ConsentProvider from '@/components/screens/public/ConsentProvider';
import '@mocks/window';
import setupI18n from '@/locales/i18nSetup';
import permissionsService from '@/service/permissions';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';
import { AUTH_STATUS_CODE } from '@/constants';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('ConsentProvider', () => {
  let $router;
  let $route;
  let wrapper;

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

  const createWrapper = ({ isAuthed, ...options } = {}) => {
    const store = createStore();
    const { authStore, accountsStore, coreStore } = createStoreModules(store);
    authStore.setAuthByCode(
      isAuthed === false ? AUTH_STATUS_CODE.LOGOUT : AUTH_STATUS_CODE.LOGGED_IN,
    );
    return shallowMount(ConsentProvider, {
      authStore,
      accountsStore,
      coreStore,
      localVue,
      i18n,
      mocks: {
        $router,
        $route,
      },
      ...options,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    $router = createRouter();
    $route = {
      query: {
        consent_challenge: 'foo',
        scopes: 'foo bar baz',
      },
    };
  });

  describe('render', () => {
    it('should correctly render ConsentProvider screen', () => {
      wrapper = createWrapper();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should takes query params from current location and assign error if consentChallenge is not in params', async () => {
      $router = createRouter();
      $router.history.current.query = {};

      wrapper = createWrapper({
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

      const redirectUrl = 'http://kek.kek';
      permissionsService.getConsentDetails.mockResolvedValueOnce({
        skip: true,
        requested_scope: [],
        redirect_url: redirectUrl,
      });

      wrapper = createWrapper();
      await global.flushPromises();

      expect(window.location.href).toBe(redirectUrl);
    });

    it('should takes query params from current location and makes redirect if consentChallenge is not empty but authorization status is falsy', () => {
      wrapper = createWrapper({ isAuthed: false });

      expect($router.replace).toBeCalled();
    });

    it('should not do anything on mounting if challengeId is present in query params and user authorized', () => {
      wrapper = createWrapper();

      expect(wrapper.vm.error).toEqual({
        show: false,
        hint: '',
        description: '',
      });
      expect($router.replace).not.toBeCalled();
    });

    it('should grant permissions on scopes form submit', async () => {
      expect.assertions(1);

      const redirectUrl = 'http://kek.kek';
      wrapper = createWrapper();
      wrapper.setData({
        scopesList: ['foo', 'bar', 'baz'],
        isLoading: false,
      });

      permissionsService.grantPermissions.mockResolvedValueOnce({
        redirect: redirectUrl,
      });

      wrapper
        .find('scopes-form-stub')
        .vm.$emit('submit', ['foo', 'bar', 'baz']);
      await global.flushPromises();

      expect(window.location.href).toBe(redirectUrl);
    });
  });
});
