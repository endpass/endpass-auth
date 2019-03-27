import { shallowMount, createLocalVue } from '@vue/test-utils';
import { loginWithGithub } from 'github-oauth-popup';
import Vuex from 'vuex';
import GitAuthButton from '@/components/common/GitAuthButton.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('GitAuthButton', () => {
  describe('render', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallowMount(GitAuthButton);
    });

    it("should correctly render GitAuthButton component empty if auth2 isn't loaded", () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('methods', () => {
    let wrapper;
    let store;
    const actions = {
      authWithGitHub: jest.fn(),
      awaitAuthConfirm: jest.fn(),
    };
    beforeEach(() => {
      store = new Vuex.Store({
        modules: {
          accounts: {
            actions,
          },
        },
      });
      wrapper = shallowMount(GitAuthButton, {
        localVue,
        store,
      });
    });

    it('should emit error when handle auth error', () => {
      const kek = new Error();
      wrapper.vm.handleAuthError(kek);
      expect(wrapper.emitted().error).toBeTruthy();
      expect(wrapper.emitted().error[0]).toEqual([kek]);
    });

    it('should correctly authorize', async () => {
      const code = 'kek';
      expect.assertions(3);
      loginWithGithub.mockResolvedValue({
        code,
      });
      await wrapper.vm.loginWithGithub();
      expect(loginWithGithub).toHaveBeenCalledWith({
        client_id: ENV.gitClientId,
        scope: 'user:email',
      });
      expect(actions.authWithGitHub).toHaveBeenCalledWith(
        expect.any(Object),
        code,
        undefined,
      );
      expect(actions.awaitAuthConfirm).toHaveBeenCalled();
    });
  });
});
