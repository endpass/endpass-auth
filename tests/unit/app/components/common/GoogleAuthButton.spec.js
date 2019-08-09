import { shallowMount, createLocalVue } from '@vue/test-utils';
import GoogleAuthButton from '@/components/common/GoogleAuthButton.vue';
import Vuex from 'vuex';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();

const i18n = setupI18n(localVue);
localVue.use(Vuex);

describe('GoogleAuthButton', () => {
  const auth = {
    signIn: jest.fn(),
    currentUser: {
      get() {
        return {
          getBasicProfile() {
            return {
              getEmail() {
                return 'email';
              },
            };
          },
          getAuthResponse() {
            return {
              id_token: 'id_token',
            };
          },
        };
      },
    },
  };

  const gapi = {
    load: jest.fn().mockImplementation((arg, cb) => {
      cb();
    }),
    auth2: {
      init: jest.fn().mockReturnValue(auth),
    },
  };

  describe('render', () => {
    let wrapper;

    describe('without gapi', () => {
      beforeEach(() => {
        window.gapi = null;
        wrapper = shallowMount(GoogleAuthButton, {
          provide: {
            theme: 'default',
          },
          localVue,
          i18n,
        });
      });

      it("should correctly render GoogleAuthButton component empty if auth2 isn't loaded", () => {
        expect(wrapper.html()).toMatchSnapshot();
      });
    });

    describe('with gapi', () => {
      beforeEach(() => {
        window.gapi = gapi;
        wrapper = shallowMount(GoogleAuthButton, {
          provide: {
            theme: 'default',
          },
          localVue,
          i18n,
        });
      });

      it('should correctly render GoogleAuthButton component if auth2 is loaded', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });
    });
  });

  describe('behaviour', () => {
    let wrapper;
    let store;
    const actions = {
      authWithGoogle: jest.fn(),
      waitLogin: jest.fn(),
    };
    beforeEach(() => {
      window.gapi = gapi;

      store = new Vuex.Store({
        modules: {
          accounts: {
            actions,
          },
        },
      });
      wrapper = shallowMount(GoogleAuthButton, {
        localVue,
        store,
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
      expect.assertions(3);

      wrapper.find('[data-test=submit-button-google]').trigger('click');
      await global.flushPromises();

      expect(window.gapi.auth2.init).toHaveBeenCalledWith({
        client_id: ENV.VUE_APP_GOOGLE_CLIENT_ID,
        scope: 'profile',
      });
      expect(actions.authWithGoogle).toHaveBeenCalledWith(
        expect.any(Object),
        { email: 'email', idToken: 'id_token' },
        undefined,
      );
      expect(wrapper.emitted().submit).toEqual([[]]);
    });
  });
});
