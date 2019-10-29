import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ConnectError from '@endpass/class/ConnectError';
import Auth from '@/components/screens/Auth';
import setupI18n from '@/locales/i18nSetup';
import { authChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { METHODS } from '@/constants';

const localVue = createLocalVue();

const { ERRORS } = ConnectError;

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('Auth', () => {
  let wrapper;
  let accountsStore;
  let authStore;

  beforeEach(() => {
    jest.clearAllMocks();

    const store = createStore();
    const {
      accountsStore: accountsStoreModule,
      authStore: authStoreModule,
      coreStore,
    } = createStoreModules(store);

    accountsStore = accountsStoreModule;
    authStore = authStoreModule;

    wrapper = shallowMount(Auth, {
      accountsStore,
      authStore,
      coreStore,
      localVue,
      i18n,
    });
  });

  describe('render', () => {
    it('should correctly render Auth screen component', () => {
      expect(wrapper.find('composite-auth-form-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should confirm auth on auth form authorize event handling', async () => {
      expect.assertions(1);

      const dataPromise = authChannel.take();
      const payload = {
        serverMode: {
          foo: 'bar',
        },
      };

      wrapper.find('composite-auth-form-stub').vm.$emit('authorize', payload);

      await global.flushPromises();
      const res = await dataPromise;

      expect(res).toEqual(Answer.createOk(payload.serverMode));
    });

    it('should cancel auth', async () => {
      expect.assertions(2);

      const dataPromise = authChannel.take();

      wrapper.find('composite-auth-form-stub').vm.$emit('cancel');

      await global.flushPromises();
      const res = await dataPromise;

      expect(res).toEqual(
        Answer.createFail(
          ERRORS.AUTH_CANCELED_BY_USER,
          i18n.t('store.auth.authCanceled'),
        ),
      );
      expect(bridgeMessenger.send).toBeCalledWith(METHODS.DIALOG_CLOSE);
    });
  });
});
