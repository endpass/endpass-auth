import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VeeValidate from 'vee-validate';
import OtpForm from '@/components/forms/CompositeAuth/Code/OtpCode/OtpForm';
import setupI18n from '@/locales/i18nSetup';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VeeValidate);
const i18n = setupI18n(localVue);

describe('Otp', () => {
  let wrapper;
  let coreStore;

  beforeEach(() => {
    jest.clearAllMocks();

    const store = createStore();
    const { coreStore: coreStoreModule } = createStoreModules(store);

    coreStore = coreStoreModule;

    wrapper = shallowMount(OtpForm, {
      coreStore,
      localVue,
      provide: {
        theme: 'default',
      },
      i18n,
      sync: false,
    });
  });

  describe('render', () => {
    it('should correctly render Otp component', () => {
      expect(wrapper.name()).toBe('OtpForm');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should correctly disable recovery link', async () => {
      expect.assertions(2);

      const recoveryLink = wrapper.find('[data-test=recovery-link]');

      coreStore.changeLoadingStatus(false);
      await wrapper.vm.$nextTick();

      expect(recoveryLink.attributes().disabled).toBeUndefined();

      coreStore.changeLoadingStatus(true);
      await wrapper.vm.$nextTick();

      expect(recoveryLink.attributes().disabled).toBeTruthy();
    });
  });

  describe('behavior', () => {
    it('should not emit recover event', () => {
      coreStore.changeLoadingStatus(true);

      wrapper.find('[data-test=recovery-link]').vm.$emit('click', {
        preventDefault: () => {},
      });

      expect(wrapper.emitted().recover).toBe(undefined);
    });

    it('should emit recover event', () => {
      coreStore.changeLoadingStatus(false);

      wrapper.find('[data-test=recovery-link]').vm.$emit('click', {
        preventDefault: () => {},
      });

      expect(wrapper.emitted().recover).toEqual([[]]);
    });
  });
});
