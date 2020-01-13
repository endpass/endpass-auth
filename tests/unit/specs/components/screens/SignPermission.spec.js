import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import SignPermission from '@/components/screens/SignPermission';
import setupI18n from '@/locales/i18nSetup';
import identityService from '@/service/identity';
import authService from '@/service/auth';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import host from '@/class/singleton/host';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('SignPermission', () => {
  describe('render', () => {
    let wrapper;
    let authStore;

    beforeEach(() => {
      const store = createStore();
      const {
        accountsStore,
        coreStore,
        authStore: authStoreModule,
      } = createStoreModules(store);

      authStore = authStoreModule;

      identityService.checkRegularPassword.mockResolvedValueOnce(true);

      wrapper = shallowMount(SignPermission, {
        accountsStore,
        coreStore,
        localVue,
        i18n,
      });
    });

    describe('render', () => {
      it('should correctly render SignPermission component', async () => {
        expect.assertions(3);

        expect(wrapper.name()).toBe('SignPermission');
        expect(wrapper.html()).toMatchSnapshot();

        await global.flushPromises();

        expect(wrapper.html()).toMatchSnapshot();
      });
    });

    describe('behavior', () => {
      it('should send sign request', async () => {
        expect.assertions(1);

        const pwd = 'foopwd123';
        await global.flushPromises();
        bridgeMessenger.sendAndWaitResponse.mockResolvedValueOnce({});
        wrapper.find('sign-password-stub').vm.$emit('submit', pwd);
        await global.flushPromises();

        expect(authService.setAuthPermission).toBeCalledWith(pwd, host.origin);
      });

      it('should logout', async () => {
        expect.assertions(2);

        await global.flushPromises();
        authStore.setAuthByCode(200);
        bridgeMessenger.sendAndWaitResponse.mockResolvedValueOnce({});

        expect(authStore.isLogin).toBe(true);

        wrapper.find('sign-password-stub').vm.$emit('logout');
        await global.flushPromises();

        expect(authStore.isLogin).toBe(false);
      });
    });
  });
});
