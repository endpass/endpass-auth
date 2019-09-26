import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { v3KeyStore } from '@unitFixtures/accounts';
import SignPermission from '@/components/screens/SignPermission';
import setupI18n from '@/locales/i18nSetup';
import identityService from '@/service/identity';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('SignPermission', () => {
  describe('render', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallowMount(SignPermission, {
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

        identityService.getAuthPermission.mockReturnValueOnce({
          keystore: v3KeyStore,
        });

        wrapper.find('sign-password-stub').vm.$emit('submit', 'foopwd');

        await global.flushPromises();

        expect(identityService.setAuthPermission).toBeCalledWith('signature');
      });
    });
  });
});
