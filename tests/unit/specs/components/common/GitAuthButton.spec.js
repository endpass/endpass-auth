import { shallowMount, createLocalVue } from '@vue/test-utils';
import { loginWithGithub } from 'github-oauth-popup';
import Vuex from 'vuex';
import { email } from '@unitFixtures/auth';
import GitAuthButton from '@/components/common/GitAuthButton';
import setupI18n from '@/locales/i18nSetup';
import authService from '@/service/auth';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('GitAuthButton', () => {
  let wrapper;

  const createWrapper = () => {
    const store = createStore();
    const { accountsStore } = createStoreModules(store);
    return shallowMount(GitAuthButton, {
      provide: {
        theme: 'default',
      },
      accountsStore,
      localVue,
      i18n,
    });
  };

  describe('render', () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it("should correctly render GitAuthButton component empty if auth2 isn't loaded", () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behaviour', () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it('should emit error when handle auth error', () => {
      const kek = new Error();
      wrapper.vm.handleAuthError(kek);

      expect(wrapper.emitted().error).toBeTruthy();
      expect(wrapper.emitted().error[0]).toEqual([kek]);
    });

    it('should correctly submit', async () => {
      expect.assertions(3);

      const code = 'kek';
      authService.authWithGitHub.mockResolvedValueOnce({
        success: true,
        email,
      });
      loginWithGithub.mockResolvedValue({
        code,
      });
      wrapper.find('[data-test=submit-button-github]').trigger('click');
      await global.flushPromises();

      expect(authService.authWithGitHub).toHaveBeenCalledWith(code);
      expect(loginWithGithub).toHaveBeenCalledWith({
        client_id: ENV.VUE_APP_GIT_CLIENT_ID,
        scope: 'user:email',
      });
      expect(wrapper.emitted().submit).toEqual([
        [
          {
            email,
          },
        ],
      ]);
    });
  });
});
