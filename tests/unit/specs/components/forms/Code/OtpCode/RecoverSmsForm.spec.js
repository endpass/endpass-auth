import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VeeValidate from 'vee-validate';
import { code, email, regularPassword as password } from '@unitFixtures/auth';
import RecoverSmsForm from '@/components/forms/Code/OtpCode/RecoverSmsForm';
import authService from '@/service/auth';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';

import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VeeValidate);
const i18n = setupI18n(localVue);

describe('RecoverSmsForm', () => {
  let wrapper;
  let authStore;
  const error = new Error('error');

  const createWrapper = options => {
    const store = createStore();
    const { authStore: authStoreModule } = createStoreModules(store);

    authStore = authStoreModule;

    return shallowMount(RecoverSmsForm, {
      authStore,
      provide: {
        theme: 'default',
      },
      propsData: {
        password,
        email,
        isSignUp: false,
      },
      localVue,
      i18n,
      sync: false,
      ...options,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render component', async () => {
      expect.assertions(2);

      await global.flushPromises();

      expect(wrapper.name()).toBe('RecoverSmsForm');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    beforeEach(async () => {
      await global.flushPromises();
    });

    describe('phone does not exist', () => {
      beforeEach(async () => {
        const errorPhoneNotExist = new Error(error.message);
        errorPhoneNotExist.code = 400;

        authService.sendOtpRecoverSms.mockRejectedValueOnce(errorPhoneNotExist);

        wrapper = createWrapper();
        await global.flushPromises();
      });

      it('should show message if phone does not exist', async () => {
        expect.assertions(2);

        expect(wrapper.find('[data-test=recover-otp]').exists()).toBe(false);
        expect(wrapper.find('[data-test=phone-not-exist]').exists()).toBe(true);
      });

      it('should cancel recover', async () => {
        expect.assertions(2);

        expect(wrapper.emitted().cancel).toBeUndefined();

        wrapper.find('[data-test=phone-not-exist]').trigger('submit');

        expect(wrapper.emitted().cancel).toEqual([[]]);
      });
    });

    describe('send sms', () => {
      it('should send recover sms on mount', async () => {
        expect.assertions(2);

        expect(authService.sendOtpRecoverSms).toBeCalledTimes(1);
        expect(authService.sendOtpRecoverSms).toBeCalledWith(email);
      });

      it('should send recover sms', async () => {
        expect.assertions(2);

        wrapper.find('[data-test=recovery-link]').vm.$emit('click', {
          preventDefault: () => {},
        });
        await global.flushPromises();

        expect(authService.sendOtpRecoverSms).toBeCalledTimes(2);
        expect(authService.sendOtpRecoverSms).toHaveBeenLastCalledWith(email);
      });

      it('should show error', async () => {
        expect.assertions(1);

        authService.sendOtpRecoverSms.mockRejectedValueOnce(error);

        wrapper = createWrapper();
        await global.flushPromises();

        expect(wrapper.find('[data-test=code-input]').attributes('error')).toBe(
          i18n.t('components.recoverOtpSms.sendSmsError'),
        );
      });
    });

    describe('disable otp', () => {
      beforeEach(async () => {
        wrapper.find('[data-test=code-input]').vm.$emit('input', code);
        wrapper.find('[data-test=recover-otp]').trigger('submit');

        await global.flushPromises();
      });

      it('should not disable otp if loading', async () => {
        expect.assertions(2);

        wrapper = createWrapper();

        wrapper.find('[data-test=code-input]').vm.$emit('input', code);
        wrapper.find('[data-test=recover-otp]').trigger('submit');
        await global.flushPromises();

        expect(authService.disableOtpViaSms).not.toBeCalledWith();
        expect(wrapper.emitted().recover).toBeUndefined();
      });

      it('should disable otp', async () => {
        expect.assertions(2);

        expect(authService.disableOtpViaSms).toBeCalledTimes(1);
        expect(authService.disableOtpViaSms).toBeCalledWith({
          code,
          email,
        });
      });

      it.only('should cancel recover', async () => {
        expect.assertions(2);

        expect(wrapper.emitted().cancel).toBeUndefined();

        wrapper.find('[data-test=cancel-button]').vm.$emit('click');

        expect(wrapper.emitted().cancel).toEqual([[]]);
      });

      describe('handle error', () => {
        beforeEach(async () => {
          authService.disableOtpViaSms.mockRejectedValueOnce(error);

          wrapper = createWrapper();
          await global.flushPromises();

          wrapper.find('[data-test=code-input]').vm.$emit('input', code);
          wrapper.find('[data-test=recover-otp]').trigger('submit');
          await global.flushPromises();
        });

        it('should show error', async () => {
          expect.assertions(1);

          expect(
            wrapper.find('[data-test=code-input]').attributes('error'),
          ).toBe(i18n.t('components.recoverOtpSms.recoverError'));
        });

        it('should not emit when error', async () => {
          expect.assertions(1);

          expect(wrapper.emitted().recover).toBeUndefined();
        });
      });
    });
  });

  describe('validation', () => {
    describe('submit', () => {
      it('should disable on mount', async () => {
        expect.assertions(1);

        expect(
          wrapper.find('[data-test=submit-button]').attributes().disabled,
        ).toBeTruthy();
      });

      describe('after mount', () => {
        beforeEach(async () => {
          await global.flushPromises();
        });

        it('should disable after mount', async () => {
          expect.assertions(1);

          expect(
            wrapper.find('[data-test=submit-button]').attributes().disabled,
          ).toBeTruthy();
        });

        it('should disable with not valid code', async () => {
          expect.assertions(1);

          wrapper
            .find('[data-test=code-input]')
            .vm.$emit('input', code.slice(0, 1));
          await global.flushPromises();

          expect(
            wrapper.find('[data-test=submit-button]').attributes().disabled,
          ).toBeTruthy();
        });

        it('should enable', async () => {
          expect.assertions(1);

          wrapper.find('[data-test=code-input]').vm.$emit('input', code);
          await global.flushPromises();

          expect(
            wrapper.find('[data-test=submit-button]').attributes().disabled,
          ).toBeUndefined();
        });
      });
    });

    describe('code', () => {
      beforeEach(async () => {
        await global.flushPromises();
      });

      it('should not have error on start', async () => {
        expect.assertions(1);

        expect(
          wrapper.find('[data-test=code-input]').attributes().error,
        ).toBeUndefined();
      });

      it('should validate invalid code', async () => {
        expect.assertions(1);

        const codeInput = wrapper.find('[data-test=code-input]');

        codeInput.vm.$emit('input', code.slice(0, 1));
        await global.flushPromises();

        expect(codeInput.attributes().error).toBeTruthy();
      });

      it('should validate valid code', async () => {
        expect.assertions(1);

        const codeInput = wrapper.find('[data-test=code-input]');

        codeInput.vm.$emit('input', code);
        await global.flushPromises();

        expect(codeInput.attributes().error).toBeUndefined();
      });
    });
  });
});
