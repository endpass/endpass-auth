import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, regularPassword as password, code } from '@unitFixtures/auth';
import EmailCodeInteractor from '@/components/screens/Authenticator/modules/Code/EmailCode/EmailCode.interactor';
import EmailCodeView from '@/components/modules/Codes/EmailCode';
import setupI18n from '@/locales/i18nSetup';
import authService from '@/service/auth';

const localVue = createLocalVue();
localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('EmailCodeInteractor', () => {
  let wrapper;
  const createWrapper = (options, props) =>
    shallowMount(EmailCodeInteractor, {
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
      expect(wrapper.name()).toBe('EmailCodeInteractor');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render form', () => {
      expect(wrapper.find('email-code-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    describe('send code', () => {
      it('should send code on mount', () => {
        expect(authService.sendEmailCode).toBeCalledTimes(1);
        expect(authService.sendEmailCode).toBeCalledWith(email);
      });

      it('should send code on event', () => {
        authService.sendEmailCode.mockClear();

        expect(authService.sendEmailCode).not.toBeCalled();

        wrapper.find(EmailCodeView).vm.$emit('send-code');

        expect(authService.sendEmailCode).toBeCalledTimes(1);
        expect(authService.sendEmailCode).toBeCalledWith(email);
      });

      describe('loading status', () => {
        it('should be false before sending', () => {
          expect(
            wrapper.find('email-code-stub').attributes().isloading,
          ).toBeFalsy();
        });

        it('should be true while sending', () => {
          wrapper.find(EmailCodeView).vm.$emit('send-code');

          expect(wrapper.find('email-code-stub').attributes().isloading).toBe(
            'true',
          );
        });

        it('should be false after sending', async () => {
          expect.assertions(1);

          wrapper.find(EmailCodeView).vm.$emit('send-code');
          await global.flushPromises();

          expect(
            wrapper.find('email-code-stub').attributes().isloading,
          ).toBeFalsy();
        });
      });

      describe('error', () => {
        beforeEach(() => {
          authService.sendEmailCode.mockRejectedValueOnce(new Error('error'));
        });

        it('should pass error', async () => {
          expect.assertions(2);

          expect(
            wrapper.find('email-code-stub').attributes().error,
          ).toBeFalsy();

          wrapper.find(EmailCodeView).vm.$emit('send-code');
          await global.flushPromises();

          expect(wrapper.find('email-code-stub').attributes().error).toBe(
            i18n.t('components.emailCode.sendError'),
          );
        });

        it('should remove error if exists before', async () => {
          expect.assertions(1);

          wrapper.find(EmailCodeView).vm.$emit('send-code');
          await global.flushPromises();

          wrapper.find(EmailCodeView).vm.$emit('send-code');

          expect(
            wrapper.find('email-code-stub').attributes().error,
          ).toBeFalsy();
        });
      });
    });

    describe('submit', () => {
      const defaultServiceParams = {
        code,
        password,
        email,
        isSignUp: false,
      };

      it('should handle submit event', () => {
        expect.assertions(3);

        expect(authService.authWithCode).not.toBeCalled();

        wrapper.find(EmailCodeView).vm.$emit('submit', { code });

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

        wrapper.find(EmailCodeView).vm.$emit('submit', { code });

        expect(authService.authWithCode).toBeCalledTimes(1);
        expect(authService.authWithCode).toBeCalledWith({
          ...defaultServiceParams,
          isSignUp: true,
        });
      });

      it('should handle submit event with remember prop', () => {
        expect.assertions(3);

        expect(authService.authWithCode).not.toBeCalled();

        wrapper
          .find(EmailCodeView)
          .vm.$emit('submit', { code, isRemember: true });

        expect(authService.authWithCode).toBeCalledTimes(1);
        expect(authService.authWithCode).toBeCalledWith({
          ...defaultServiceParams,
          isRemember: true,
        });
      });

      it('should not handle submit event when loading status true', async () => {
        expect.assertions(1);

        wrapper.find(EmailCodeView).vm.$emit('submit', { code });
        wrapper.find(EmailCodeView).vm.$emit('submit', { code });

        expect(authService.authWithCode).toBeCalledTimes(1);
      });

      describe('loading status', () => {
        it('should be false before submit', () => {
          expect(
            wrapper.find('email-code-stub').attributes().isloading,
          ).toBeFalsy();
        });

        it('should be true after submit', () => {
          wrapper.find(EmailCodeView).vm.$emit('submit', { code });

          expect(wrapper.find('email-code-stub').attributes().isloading).toBe(
            'true',
          );
        });

        it('should be false after handling submit', async () => {
          expect.assertions(1);

          wrapper.find(EmailCodeView).vm.$emit('submit', { code });
          await global.flushPromises();

          expect(
            wrapper.find('email-code-stub').attributes().isloading,
          ).toBeFalsy();
        });
      });

      describe('error', () => {
        beforeEach(() => {
          authService.authWithCode.mockRejectedValueOnce(new Error('error'));
        });

        it('should pass error', async () => {
          expect.assertions(2);

          expect(
            wrapper.find('email-code-stub').attributes().error,
          ).toBeFalsy();

          wrapper.find(EmailCodeView).vm.$emit('submit', { code });
          await global.flushPromises();

          expect(wrapper.find('email-code-stub').attributes().error).toBe(
            i18n.t('components.otpBlock.authFailed'),
          );
        });

        it('should remove error if exists before submit', async () => {
          expect.assertions(1);

          wrapper.find(EmailCodeView).vm.$emit('submit', { code });
          await global.flushPromises();

          wrapper.find(EmailCodeView).vm.$emit('submit', { code });

          expect(
            wrapper.find('email-code-stub').attributes().error,
          ).toBeFalsy();
        });
      });
    });
  });
});
