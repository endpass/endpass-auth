import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import SignPasswordForm from '@/components/formsComposite/SignPassword';
import setupI18n from '@/locales/i18nSetup';
import identityService from '@/service/identity';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

jest.useFakeTimers();

describe('SignPasswordForm', () => {
  let wrapper;
  let accountsStore;
  let authStore;

  const createWrapper = () => {
    const store = createStore();
    const {
      authStore: authStoreModule,
      accountsStore: accountStoreModule,
      coreStore,
    } = createStoreModules(store);

    authStore = authStoreModule;
    accountsStore = accountStoreModule;

    return shallowMount(SignPasswordForm, {
      accountsStore,
      coreStore,
      localVue,
      provide: {
        theme: 'default',
      },
      i18n,
    });
  };

  beforeEach(() => {
    jest.clearAllTimers();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      wrapper = createWrapper();
      expect(wrapper.name()).toBe('SignPasswordForm');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should show create account form', async () => {
      expect.assertions(2);

      identityService.checkAccountExist.mockResolvedValueOnce(false);

      wrapper = createWrapper();

      await global.flushPromises();

      expect(wrapper.find('create-wallet-form-stub').exists()).toBe(true);

      accountsStore.setWalletCreated();
      jest.runOnlyPendingTimers();
      await global.flushPromises();

      expect(wrapper.find('password-form-stub').exists()).toBe(true);
    });

    it('should do logout', async () => {
      expect.assertions(3);

      bridgeMessenger.sendAndWaitResponse.mockResolvedValueOnce({});

      wrapper = createWrapper();

      authStore.setAuthByCode(200);

      expect(authStore.isLogin).toBe(true);

      wrapper.find('password-form-stub').vm.$emit('logout');

      await global.flushPromises();

      expect(authStore.isLogin).toBe(false);
      expect(wrapper.emitted().cancel).toBeTruthy();
    });
  });
});
