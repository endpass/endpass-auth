import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, regularPassword as password, code } from '@unitFixtures/auth';
import RegularPasswordRecoveryInteractor from '@/components/screens/Authenticator/modules/RegularPasswordRecovery/RegularPasswordRecovery.interactor';
import RegularPasswordRecoveryPhone from '@/components/screens/Authenticator/modules/RegularPasswordRecovery/RegularPasswordRecovery.view';
import setupI18n from '@/locales/i18nSetup';
import authService from '@/service/auth';
import identityService from '@/service/identity';

const localVue = createLocalVue();
localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('RegularPasswordRecoveryInteractor', () => {
  let wrapper;
  const createWrapper = (options, props) =>
    shallowMount(RegularPasswordRecoveryInteractor, {
      localVue,
      propsData: {
        email,
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
      expect(wrapper.name()).toBe('RegularPasswordRecoveryInteractor');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render form', () => {
      expect(wrapper.find('regular-password-recovery-stub').exists()).toBe(
        true,
      );
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    describe('cancel', () => {
      it('should emit cancel', () => {
        expect(wrapper.emitted().cancel).toBeUndefined();

        wrapper.find(RegularPasswordRecoveryPhone).vm.$emit('cancel');

        expect(wrapper.emitted().cancel.length).toBe(1);
        expect(wrapper.emitted().cancel[0]).toEqual([]);
      });
    });

    describe('send code', () => {
      it('should send code on mount', () => {
        expect(authService.sendEmailCode).toBeCalledTimes(1);
        expect(authService.sendEmailCode).toBeCalledWith(email);
      });

      it('should send code on event', () => {
        authService.sendEmailCode.mockClear();

        expect(authService.sendEmailCode).not.toBeCalled();

        wrapper.find(RegularPasswordRecoveryPhone).vm.$emit('send-code');

        expect(authService.sendEmailCode).toBeCalledTimes(1);
        expect(authService.sendEmailCode).toBeCalledWith(email);
      });

      it('should not send code when loading', () => {
        authService.sendEmailCode.mockClear();

        expect(authService.sendEmailCode).not.toBeCalled();

        wrapper.find(RegularPasswordRecoveryPhone).vm.$emit('send-code');
        wrapper.find(RegularPasswordRecoveryPhone).vm.$emit('send-code');

        expect(authService.sendEmailCode).toBeCalledTimes(1);
        expect(authService.sendEmailCode).toBeCalledWith(email);
      });

      describe('loading status', () => {
        it('should be false before sending', () => {
          expect(
            wrapper.find('regular-password-recovery-stub').attributes()
              .isloading,
          ).toBeFalsy();
        });

        it('should be true while sending', () => {
          wrapper.find(RegularPasswordRecoveryPhone).vm.$emit('send-code');

          expect(
            wrapper.find('regular-password-recovery-stub').attributes()
              .isloading,
          ).toBe('true');
        });

        it('should be false after sending', async () => {
          expect.assertions(1);

          wrapper.find(RegularPasswordRecoveryPhone).vm.$emit('send-code');
          await global.flushPromises();

          expect(
            wrapper.find('regular-password-recovery-stub').attributes()
              .isloading,
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
            wrapper.find('regular-password-recovery-stub').attributes().error,
          ).toBeFalsy();

          wrapper.find(RegularPasswordRecoveryPhone).vm.$emit('send-code');
          await global.flushPromises();

          expect(
            wrapper.find('regular-password-recovery-stub').attributes().error,
          ).toBe(i18n.t('components.createPassword.sendError'));
        });

        it('should remove error if exists before', async () => {
          expect.assertions(1);

          wrapper.find(RegularPasswordRecoveryPhone).vm.$emit('send-code');
          await global.flushPromises();

          wrapper.find(RegularPasswordRecoveryPhone).vm.$emit('send-code');

          expect(
            wrapper.find('regular-password-recovery-stub').attributes().error,
          ).toBeFalsy();
        });
      });
    });

    describe('submit', () => {
      const defaultServiceParams = {
        code,
        password,
      };

      it('should handle submit event', () => {
        expect.assertions(3);

        expect(identityService.confirmResetRegularPassword).not.toBeCalled();

        wrapper
          .find(RegularPasswordRecoveryPhone)
          .vm.$emit('submit', { password, code });

        expect(identityService.confirmResetRegularPassword).toBeCalledTimes(1);
        expect(identityService.confirmResetRegularPassword).toBeCalledWith({
          ...defaultServiceParams,
        });
      });

      it('should not handle submit event when loading status true', async () => {
        expect.assertions(1);

        wrapper.find(RegularPasswordRecoveryPhone).vm.$emit('submit', { code });
        wrapper.find(RegularPasswordRecoveryPhone).vm.$emit('submit', { code });

        expect(identityService.confirmResetRegularPassword).toBeCalledTimes(1);
      });

      it('should emit event after submit handling', async () => {
        expect.assertions(3);

        expect(wrapper.emitted()['password-recovered']).toBeUndefined();

        wrapper
          .find(RegularPasswordRecoveryPhone)
          .vm.$emit('submit', { password, code });
        await global.flushPromises();

        expect(wrapper.emitted()['password-recovered'].length).toBe(1);
        expect(wrapper.emitted()['password-recovered'][0]).toEqual([
          { password },
        ]);
      });

      describe('loading status', () => {
        it('should be false before submit', () => {
          expect(
            wrapper.find('regular-password-recovery-stub').attributes()
              .isloading,
          ).toBeFalsy();
        });

        it('should be true after submit', () => {
          wrapper
            .find(RegularPasswordRecoveryPhone)
            .vm.$emit('submit', { code });

          expect(
            wrapper.find('regular-password-recovery-stub').attributes()
              .isloading,
          ).toBe('true');
        });

        it('should be false after handling submit', async () => {
          expect.assertions(1);

          wrapper
            .find(RegularPasswordRecoveryPhone)
            .vm.$emit('submit', { code });
          await global.flushPromises();

          expect(
            wrapper.find('regular-password-recovery-stub').attributes()
              .isloading,
          ).toBeFalsy();
        });
      });

      describe('error', () => {
        beforeEach(() => {
          identityService.confirmResetRegularPassword.mockRejectedValueOnce(
            new Error('error'),
          );
        });

        it('should pass error', async () => {
          expect.assertions(2);

          expect(
            wrapper.find('regular-password-recovery-stub').attributes().error,
          ).toBeFalsy();

          wrapper
            .find(RegularPasswordRecoveryPhone)
            .vm.$emit('submit', { code });
          await global.flushPromises();

          expect(
            wrapper.find('regular-password-recovery-stub').attributes().error,
          ).toBe(i18n.t('components.regularPasswordRecover.recoveryError'));
        });

        it('should remove error if exists before submit', async () => {
          expect.assertions(1);

          wrapper
            .find(RegularPasswordRecoveryPhone)
            .vm.$emit('submit', { code });
          await global.flushPromises();

          wrapper
            .find(RegularPasswordRecoveryPhone)
            .vm.$emit('submit', { code });

          expect(
            wrapper.find('regular-password-recovery-stub').attributes().error,
          ).toBeFalsy();
        });
      });
    });
  });
});
