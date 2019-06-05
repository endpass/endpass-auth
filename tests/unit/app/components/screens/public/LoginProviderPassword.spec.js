import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import '@mocks/window';
import LoginProviderPassword from '@/components/screens/public/LoginProviderPassword';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('LoginProviderPassword', () => {
  let wrapper;
  let store;
  let storeData;
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
    storeData = {
      modules: {
        accounts: accountsModule,
      },
    };
    store = new Vuex.Store(storeData);

    wrapper = shallowMount(LoginProviderPassword, {
      localVue,
      store,
    });
  });

  describe('render', () => {
    it('should correctly render LoginProviderPassword screen', () => {
      wrapper = shallowMount(LoginProviderPassword, {
        localVue,
        store,
      });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should show error if challengeId is not in props', () => {
      wrapper = shallowMount(LoginProviderPassword, {
        localVue,
        store,
      });

      expect(wrapper.find('[data-test=error-message]').exists()).toBe(true);
      expect(wrapper.find('sign-password-stub').exists()).toBe(false);
    });

    describe('password submit', () => {
      const password = 'foo';
      const challengeId = 'bar';

      it('should handle password submit and makes hydra login', async () => {
        expect.assertions(2);

        accountsModule.actions.authWithOauth.mockResolvedValueOnce({
          redirect: 'new/path',
        });

        wrapper.setProps({
          loginChallenge: challengeId,
        });
        wrapper.find('sign-password-stub').vm.$emit('submit', password);

        expect(accountsModule.actions.authWithOauth).toBeCalledWith(
          expect.any(Object),
          {
            password,
            challengeId,
          },
          undefined,
        );

        await wrapper.vm.$nextTick();

        expect(window.location.href).toBe('new/path');
      });

      it('should render error if submit failed', async () => {
        expect.assertions(1);

        const errorMessage = 'ivyweed perturbing Laparosticti';
        const error = new Error(errorMessage);

        accountsModule.actions.authWithOauth.mockRejectedValueOnce(error);
        wrapper.setProps({
          loginChallenge: challengeId,
        });
        wrapper.find('sign-password-stub').vm.$emit('submit', password);

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.error).toBe(errorMessage);
      });
    });
  });
});
