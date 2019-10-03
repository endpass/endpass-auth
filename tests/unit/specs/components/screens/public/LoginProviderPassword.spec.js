import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import '@mocks/window';
import LoginProviderPassword from '@/components/screens/public/LoginProviderPassword';
import setupI18n from '@/locales/i18nSetup';
import permissionsService from '@/service/permissions';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('LoginProviderPassword', () => {
  let wrapper;

  const createWrapper = () => {
    const store = createStore();
    const { accountsStore } = createStoreModules(store);

    return shallowMount(LoginProviderPassword, {
      accountsStore,
      localVue,
      i18n,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = jest.fn();

    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render LoginProviderPassword screen', () => {
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

        permissionsService.login.mockRejectedValueOnce(error);
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
