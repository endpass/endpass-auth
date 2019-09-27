import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import '@mocks/window';
import LoginProvider from '@/components/screens/public/LoginProvider';
import setupI18n from '@/locales/i18nSetup';
import permissionsService from '@/service/permissions';
import userService from '@/service/user';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('LoginProvider', () => {
  let $router;
  let $route;
  let wrapper;

  const createWrapper = ({ isAuthed, ...options } = {}) => {
    const store = createStore();
    const { accountsStore } = createStoreModules(store);

    if (isAuthed === true) {
      accountsStore.setAuthByCode(200);
    }
    if (isAuthed === false) {
      accountsStore.setAuthByCode(400);
    }

    return shallowMount(LoginProvider, {
      accountsStore,
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
    window.location.href = jest.fn();

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
    $route = {
      query: {
        login_challenge: 'foo',
      },
    };
  });

  describe('render', () => {
    it('should correctly render LoginProvider screen', () => {
      wrapper = createWrapper();

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('[data-test=error-message]').exists()).toBe(false);
    });
  });

  describe('behavior', () => {
    it('should takes query params from current location and assign error if challengeId is not in params', () => {
      wrapper = createWrapper({
        mocks: {
          $router,
          $route: {
            query: {},
          },
        },
      });

      expect(wrapper.find('sign-password-stub').exists()).toBe(false);
      expect($router.replace).not.toBeCalled();
    });

    it('should takes query params from current location and makes redirect if challengeId is not empty but authorization status is falsy', () => {
      wrapper = createWrapper({ isAuthed: false });

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

        wrapper = createWrapper();
        await global.flushPromises();

        expect(window.location.replace).not.toBeCalled();
      });

      it('should show error if check oauth if fault', async () => {
        expect.assertions(1);

        permissionsService.getLoginDetails.mockRejectedValueOnce('error');

        wrapper = createWrapper({ isAuthed: true });
        await global.flushPromises();

        expect(wrapper.find('[data-test=error-message]').exists()).toBe(true);
      });

      it('should make redirect if skip status is truthy on received redirect url', async () => {
        expect.assertions(1);

        const payload = {
          skip: true,
          redirect: 'http://foo.bar',
        };
        permissionsService.getLoginDetails.mockResolvedValueOnce(payload);
        wrapper = createWrapper({ isAuthed: true });
        await global.flushPromises();

        expect(window.location.replace).toBeCalledWith(payload.redirect);
      });
    });

    it('should not do anything on mounting if challengeId is present in query params and user authorized', async () => {
      expect.assertions(2);

      permissionsService.getLoginDetails.mockResolvedValueOnce({
        skip: false,
      });

      wrapper = createWrapper({ isAuthed: true });
      await global.flushPromises();

      expect(wrapper.vm.error).toBeNull();
      expect($router.replace).not.toBeCalled();
    });

    it('should request user settings', async () => {
      expect.assertions(1);

      permissionsService.getLoginDetails.mockResolvedValueOnce({
        skip: false,
      });

      wrapper = createWrapper({ isAuthed: true });
      await global.flushPromises();

      expect(userService.getSettingsSkipPermission).toBeCalled();
    });
  });
});
