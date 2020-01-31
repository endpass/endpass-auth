import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, regularPassword as password, code } from '@unitFixtures/auth';
import OtpCodeInteractor from '@/components/screens/Authenticator/modules/OtpCode/OtpCode.interactor';
import OtpCodeView from '@/components/modules/OtpCode';
import setupI18n from '@/locales/i18nSetup';
import authService from '@/service/auth';

const localVue = createLocalVue();
localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('OtpCodeInteractor', () => {
  let wrapper;
  const createWrapper = (options, props) =>
    shallowMount(OtpCodeInteractor, {
      localVue,
      propsData: {
        email,
        password,
        isSignUp: false,
        ...props,
      },
      i18n,
      ...options,
    });

  beforeEach(async () => {
    jest.clearAllMocks();

    wrapper = createWrapper();
    await global.flushPromises();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('OtpCodeInteractor');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render form', () => {
      expect(wrapper.find('otp-code-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    describe('submit', () => {
      const defaultServiceParams = {
        code,
        password,
        email,
        isSignUp: false,
      };

      it('should handle submit event', async () => {
        expect.assertions(3);

        expect(authService.authWithCode).not.toBeCalled();

        wrapper.find(OtpCodeView).vm.$emit('submit', { code });

        expect(authService.authWithCode).toBeCalledTimes(1);
        expect(authService.authWithCode).toBeCalledWith({
          ...defaultServiceParams,
        });
      });

      it('should handle submit event with sign up prop', async () => {
        expect.assertions(3);

        wrapper = createWrapper({}, { isSignUp: true });
        await global.flushPromises();

        expect(authService.authWithCode).not.toBeCalled();

        wrapper.find(OtpCodeView).vm.$emit('submit', { code });

        expect(authService.authWithCode).toBeCalledTimes(1);
        expect(authService.authWithCode).toBeCalledWith({
          ...defaultServiceParams,
          isSignUp: true,
        });
      });

      it('should handle submit event with remember prop', async () => {
        expect.assertions(3);

        expect(authService.authWithCode).not.toBeCalled();

        wrapper
          .find(OtpCodeView)
          .vm.$emit('submit', { code, isRemember: true });

        expect(authService.authWithCode).toBeCalledTimes(1);
        expect(authService.authWithCode).toBeCalledWith({
          ...defaultServiceParams,
          isRemember: true,
        });
      });

      it('should not handle submit event when loading status true', async () => {
        expect.assertions(2);

        expect(authService.authWithCode).not.toBeCalled();

        wrapper.find(OtpCodeView).vm.$emit('submit', { code });
        wrapper.find(OtpCodeView).vm.$emit('submit', { code });

        expect(authService.authWithCode).toBeCalledTimes(1);
      });

      describe('loading status', () => {
        it('should be false before submit', () => {
          expect(
            wrapper.find('otp-code-stub').attributes().isloading,
          ).toBeFalsy();
        });

        it('should be true after submit', () => {
          wrapper.find(OtpCodeView).vm.$emit('submit', { code });

          expect(wrapper.find('otp-code-stub').attributes().isloading).toBe(
            'true',
          );
        });

        it('should be false after handling submit', async () => {
          expect.assertions(1);

          wrapper.find(OtpCodeView).vm.$emit('submit', { code });
          await global.flushPromises();

          expect(
            wrapper.find('otp-code-stub').attributes().isloading,
          ).toBeFalsy();
        });
      });

      describe('error', () => {
        beforeEach(() => {
          authService.authWithCode.mockRejectedValueOnce(new Error('error'));
        });

        it('should pass error', async () => {
          expect.assertions(2);

          expect(wrapper.find('otp-code-stub').attributes().error).toBeFalsy();

          wrapper.find(OtpCodeView).vm.$emit('submit', { code });
          await global.flushPromises();

          expect(wrapper.find('otp-code-stub').attributes().error).toBe(
            i18n.t('components.otpBlock.authFailed'),
          );
        });

        it('should remove error if exists before submit', async () => {
          expect.assertions(1);

          wrapper.find(OtpCodeView).vm.$emit('submit', { code });
          await global.flushPromises();

          wrapper.find(OtpCodeView).vm.$emit('submit', { code });

          expect(wrapper.find('otp-code-stub').attributes().error).toBeFalsy();
        });
      });
    });

    describe('recover', () => {
      it('should emit recover event', () => {
        expect(wrapper.emitted().recover).toBeUndefined();

        wrapper.find(OtpCodeView).vm.$emit('recover');

        expect(wrapper.emitted().recover.length).toBe(1);
        expect(wrapper.emitted().recover[0]).toEqual([]);
      });

      it('should not emit recover event while loading', () => {
        wrapper.find(OtpCodeView).vm.$emit('submit', { code });
        wrapper.find(OtpCodeView).vm.$emit('recover');

        expect(wrapper.emitted().recover).toBeUndefined();
      });
    });
  });
});
