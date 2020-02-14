import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import '@mocks/window';
import LoginProviderInteractor from '@/components/screens/public/LoginProvider/LoginProvider.interactor';
import setupI18n from '@/locales/i18nSetup';
import permissionsService from '@/service/permissions';
import userService from '@/service/user';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { AUTH_STATUS_CODE, METHODS } from '@/constants';

const localVue = createLocalVue();
localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('LoginProviderInteractor', () => {
  let wrapper;
  let $router;
  let $route;

  const createWrapper = ({ isAuthed, ...options } = {}) => {
    const store = createStore();
    const { authStore, accountsStore } = createStoreModules(store);

    if (isAuthed === true) {
      authStore.updateAuthStateByStatus(AUTH_STATUS_CODE.LOGGED_IN);
    }
    if (isAuthed === false) {
      authStore.updateAuthStateByStatus(AUTH_STATUS_CODE.LOGOUT);
    }
    return shallowMount(LoginProviderInteractor, {
      authStore,
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

  const createRouters = () => {
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
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    createRouters();
    wrapper = createWrapper();
    await global.flushPromises();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('LoginProviderInteractor');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render form', () => {
      expect(wrapper.find('login-provider-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should takes query params from current location and assign error if challengeId is not in params', () => {
      createRouters();
      wrapper = createWrapper({
        mocks: {
          $router,
          $route: {
            query: {},
          },
        },
      });

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
        expect.assertions(2);

        permissionsService.getLoginDetails.mockRejectedValueOnce('error');

        wrapper = createWrapper({ isAuthed: true });

        expect(wrapper.find('login-provider-stub').attributes().error).toBe('');

        await global.flushPromises();

        expect(wrapper.find('login-provider-stub').attributes().error).toBe(
          i18n.t('components.loginProvider.notWorkingError'),
        );
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

      createRouters();
      wrapper = createWrapper({ isAuthed: true });
      await global.flushPromises();

      expect(wrapper.find('login-provider-stub').attributes().error).toBe('');
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

    it('should cancel and close login', () => {
      wrapper = createWrapper();

      wrapper.find('v-frame-stub').vm.$emit('close');

      expect(bridgeMessenger.send).toBeCalledWith(METHODS.DIALOG_CLOSE);
    });

    it('should handle password submit and makes hydra login', async () => {
      expect.assertions(1);

      permissionsService.getLoginDetails.mockResolvedValueOnce({});

      wrapper
        .find('login-provider-stub')
        .vm.$emit('complete', { redirect: 'new/path' });

      await global.flushPromises();

      expect(window.location.href).toBe('new/path');
    });
  });
});
