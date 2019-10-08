import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import '@mocks/window';
import LoginProviderCode from '@/components/screens/public/LoginProvider/LoginProviderCode';
import setupI18n from '@/locales/i18nSetup';
import permissionsService from '@/service/permissions';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('LoginProviderCode', () => {
  let wrapper;

  const createWrapper = options => {
    const store = createStore();
    const { accountsStore } = createStoreModules(store);

    return shallowMount(LoginProviderCode, {
      accountsStore,
      localVue,
      i18n,
      ...options,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = jest.fn();

    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render LoginProviderCode screen', () => {
      wrapper = createWrapper();

      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should show error if challengeId is not in props', () => {
      wrapper = createWrapper();

      expect(wrapper.find('[data-test=error-message]').exists()).toBe(true);
      expect(wrapper.find('sign-password-stub').exists()).toBe(false);
    });

    describe('password submit', () => {
      const code = 'foo';
      const challengeId = 'bar';

      it('should handle password submit and makes hydra login', async () => {
        expect.assertions(1);

        wrapper = createWrapper({
          propsData: {
            loginChallenge: challengeId,
          },
        });
        permissionsService.getLoginDetails.mockResolvedValueOnce({});
        permissionsService.login.mockResolvedValueOnce({
          redirect: 'new/path',
        });

        wrapper.vm.authWithCode(code);

        await global.flushPromises();

        expect(window.location.href).toBe('new/path');
      });
    });
  });
});
