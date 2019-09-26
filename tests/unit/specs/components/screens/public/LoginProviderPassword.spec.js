import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import '@mocks/window';
import LoginProviderPassword from '@/components/screens/public/LoginProviderPassword';
import setupI18n from '@/locales/i18nSetup';
import permissionsService from '@/service/permissions';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('LoginProviderPassword', () => {
  let wrapper;
  let store;
  let accountsModule;

  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = jest.fn();

    accountsModule = {
      state: {
        isLogin: true,
        isPermission: true,
      },
      actions: {
        authWithOauth: jest.fn(),
        checkOauthLoginRequirements: jest.fn().mockResolvedValue({
          skip: false,
        }),
      },
      getters: {
        isAuthorized: jest.fn(
          () =>
            accountsModule.state.isLogin && accountsModule.state.isPermission,
        ),
      },
    };

    wrapper = shallowMount(LoginProviderPassword, {
      localVue,
      i18n,
    });
  });

  describe('render', () => {
    it('should correctly render LoginProviderPassword screen', () => {
      wrapper = shallowMount(LoginProviderPassword, {
        localVue,
        store,
        i18n,
      });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should show error if challengeId is not in props', () => {
      wrapper = shallowMount(LoginProviderPassword, {
        localVue,
        store,
        i18n,
      });

      expect(wrapper.find('[data-test=error-message]').exists()).toBe(true);
      expect(wrapper.find('sign-password-stub').exists()).toBe(false);
    });

    describe('password submit', () => {
      const password = 'foo';
      const challengeId = 'bar';

      it('should handle password submit and makes hydra login', async () => {
        expect.assertions(1);

        permissionsService.getLoginDetails.mockResolvedValueOnce({});
        permissionsService.login.mockResolvedValueOnce({
          redirect: 'new/path',
        });

        wrapper.setProps({
          loginChallenge: challengeId,
        });
        wrapper.find('sign-password-stub').vm.$emit('submit', password);

        await global.flushPromises();

        expect(window.location.href).toBe('new/path');
      });

      it('should render error if submit failed', async () => {
        expect.assertions(1);

        const errorMessage = 'ivyweed perturbing Laparosticti';
        const error = new Error(errorMessage);

        permissionsService.getLoginDetails.mockRejectedValueOnce(error);
        wrapper.setProps({
          loginChallenge: challengeId,
        });
        wrapper.find('sign-password-stub').vm.$emit('submit', password);

        await global.flushPromises();

        expect(wrapper.vm.error).toBe('Password is incorrect');
      });
    });
  });
});
