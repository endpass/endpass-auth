import { shallowMount, createLocalVue } from '@vue/test-utils';
import { loginWithGithub } from 'github-oauth-popup';
import Vuex from 'vuex';
import GitAuthButton from '@/components/common/GitAuthButton';
import setupI18n from '@/locales/i18nSetup';
import identityService from '@/service/identity';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('GitAuthButton', () => {
  describe('render', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallowMount(GitAuthButton, {
        provide: {
          theme: 'default',
        },
        localVue,
        i18n,
      });
    });

    it("should correctly render GitAuthButton component empty if auth2 isn't loaded", () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behaviour', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallowMount(GitAuthButton, {
        localVue,
        provide: {
          theme: 'default',
        },
        i18n,
      });
    });

    it('should emit error when handle auth error', () => {
      const kek = new Error();
      wrapper.vm.handleAuthError(kek);

      expect(wrapper.emitted().error).toBeTruthy();
      expect(wrapper.emitted().error[0]).toEqual([kek]);
    });

    it('should correctly submit', async () => {
      expect.assertions(2);

      const code = 'kek';
      identityService.authWithGitHub.mockResolvedValueOnce({
        success: true,
      });
      loginWithGithub.mockResolvedValue({
        code,
      });
      wrapper.find('[data-test=submit-button-github]').trigger('click');
      await global.flushPromises();

      expect(loginWithGithub).toHaveBeenCalledWith({
        client_id: ENV.VUE_APP_GIT_CLIENT_ID,
        scope: 'user:email',
      });
      expect(wrapper.emitted().submit).toEqual([[]]);
    });
  });
});
