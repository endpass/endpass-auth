import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import RecoverForm from '@/components/forms/Code/OtpCode/RecoverForm';
import identityService from '@/service/identity';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';

import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe.skip('Recover', () => {
  const seedPhrase = 'foo bar foo bar foo bar foo bar foo bar foo bar';
  let wrapper;
  let authStore;

  beforeEach(() => {
    const store = createStore();
    const { authStore: authStoreModule, coreStore } = createStoreModules(store);

    authStore = authStoreModule;

    wrapper = shallowMount(RecoverForm, {
      authStore,
      coreStore,
      provide: {
        theme: 'default',
      },
      localVue,
      i18n,
    });
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('RecoverForm');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render error', () => {
      const error = 'error';

      wrapper.setProps({ error });

      expect(wrapper.find('v-input-stub').attributes('error')).toBe(error);
    });

    it('should correctly disable submit button', () => {
      const submitButton = wrapper.find('[data-test=submit-button]');

      wrapper.setProps({
        isLoading: true,
      });

      expect(submitButton.text()).toBe('Loading...');
      expect(submitButton.attributes().disabled).toBeTruthy();

      wrapper.setProps({
        isLoading: false,
      });

      expect(submitButton.text()).toBe('Confirm');
      expect(submitButton.attributes().disabled).toBeTruthy();

      wrapper.setProps({
        isLoading: false,
      });
      wrapper.setData({ seedPhrase });

      expect(submitButton.text()).toBe('Confirm');
      expect(submitButton.attributes().disabled).toBeUndefined();
    });
  });

  describe('behavior', () => {
    it('should not allow submit form if seed phrase is invalid', () => {
      const form = wrapper.find('form');

      wrapper.setData({
        seedPhrase: '',
      });

      form.trigger('submit');
      expect(wrapper.emitted().submit).toBe(undefined);

      wrapper.setData({
        seedPhrase: 'foo bar',
      });

      form.trigger('submit');
      expect(wrapper.emitted().submit).toBe(undefined);
    });

    it('should submit form', () => {
      wrapper.setData({ seedPhrase });

      wrapper.find('form').trigger('submit');
      expect(wrapper.emitted().submit).toEqual([[seedPhrase]]);
    });

    it('should handle errors', async () => {
      expect.assertions(1);

      const error = new Error('error message');

      wrapper.setData({ seedPhrase });
      identityService.getRecoveryIdentifier.mockRejectedValueOnce(error);

      global.console.error = jest.fn();

      wrapper.find('form-stub').vm.$emit('submit');

      await global.flushPromises();

      expect(wrapper.vm.error).toBe(error.message);
    });

    describe('recover form', () => {
      describe('submit event', () => {
        // const seedPhrase = 'foo bar foo bar foo bar foo bar foo bar foo bar';

        beforeEach(() => {
          // wrapper.find('otp-form-stub').vm.$emit('recover');
          // wrapper.find('[data-test=seed-phrase]').vm.$emit('input', seedPhrase);
        });

        it('should handle recover event', async () => {
          expect.assertions(3);

          authStore.setAuthParams({
            redirectUrl: 'redirectUrl',
          });

          wrapper
            .find('[data-test=recover-form]')
            .trigger('submit', { seedPhrase });

          await global.flushPromises();

          expect(identityService.disableOtp).toHaveBeenCalledTimes(1);
          expect(identityService.disableOtp).toHaveBeenCalledWith(
            null,
            undefined,
            'redirectUrl',
          );
        });

        it('should handle errors', async () => {
          expect.assertions(1);

          const error = new Error('error message');

          identityService.recover.mockRejectedValue(error);
          global.console.error = jest.fn();

          wrapper.find('recover-form-stub').vm.$emit('submit', seedPhrase);

          await global.flushPromises();

          expect(wrapper.vm.error).toBe(error.message);
        });
      });
    });
  });
});
