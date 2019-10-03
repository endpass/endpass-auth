import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import SignPermission from '@/components/screens/SignPermission';
import setupI18n from '@/locales/i18nSetup';
import identityService from '@/service/identity';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';
import { ORIGIN_HOST } from '@/constants';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('SignPermission', () => {
  describe('render', () => {
    let wrapper;

    beforeEach(() => {
      const store = createStore();
      const { accountsStore, coreStore } = createStoreModules(store);

      wrapper = shallowMount(SignPermission, {
        accountsStore,
        coreStore,
        localVue,
        i18n,
      });
    });

    describe('render', () => {
      it('should correctly render SignPermission component', () => {
        expect(wrapper.name()).toBe('SignPermission');
        expect(wrapper.html()).toMatchSnapshot();
      });
    });

    describe('behavior', () => {
      it('should send sign request', async () => {
        expect.assertions(1);

        const pwd = 'foopwd123';

        wrapper.find('sign-password-stub').vm.$emit('submit', pwd);

        await global.flushPromises();

        expect(identityService.setAuthPermission).toBeCalledWith(
          pwd,
          ORIGIN_HOST,
        );
      });
    });
  });
});
