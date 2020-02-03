import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, code } from '@unitFixtures/auth';
import OtpRecoveryInteractor from '@/components/screens/Authenticator/modules/OtpRecovery/OtpRecovery.interactor';
import OtpRecoveryView from '@/components/modules/OtpRecovery';
import setupI18n from '@/locales/i18nSetup';
import authService from '@/service/auth';

const localVue = createLocalVue();
localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('OtpRecoveryInteractor', () => {
  let wrapper;
  const createWrapper = (options, props) =>
    shallowMount(OtpRecoveryInteractor, {
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
      expect(wrapper.name()).toBe('OtpRecoveryInteractor');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render form', () => {
      expect(wrapper.find('otp-recovery-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    describe('submit', () => {
      const defaultServiceParams = {
        code,
        email,
      };

      it('should handle submit event', async () => {
        expect.assertions(3);

        expect(authService.disableOtpViaSms).not.toBeCalled();

        wrapper.find(OtpRecoveryView).vm.$emit('submit', { code });

        expect(authService.disableOtpViaSms).toBeCalledTimes(1);
        expect(authService.disableOtpViaSms).toBeCalledWith({
          ...defaultServiceParams,
        });
      });

      it('should emit event after handling submit', async () => {
        expect.assertions(3);

        expect(wrapper.emitted()['otp-recovered']).toBeUndefined();

        wrapper.find(OtpRecoveryView).vm.$emit('submit', { code });
        await global.flushPromises();

        expect(wrapper.emitted()['otp-recovered']).toHaveLength(1);
        expect(wrapper.emitted()['otp-recovered'][0]).toEqual([]);
      });

      it('should not handle submit event when loading status true', async () => {
        expect.assertions(2);

        expect(authService.disableOtpViaSms).not.toBeCalled();

        wrapper.find(OtpRecoveryView).vm.$emit('submit', { code });
        wrapper.find(OtpRecoveryView).vm.$emit('submit', { code });

        expect(authService.disableOtpViaSms).toBeCalledTimes(1);
      });

      describe('loading status', () => {
        it('should be false before submit', () => {
          expect(
            wrapper.find('otp-recovery-stub').attributes().isloading,
          ).toBeFalsy();
        });

        it('should be true after submit', () => {
          wrapper.find(OtpRecoveryView).vm.$emit('submit', { code });

          expect(wrapper.find('otp-recovery-stub').attributes().isloading).toBe(
            'true',
          );
        });

        it('should be false after handling submit', async () => {
          expect.assertions(1);

          wrapper.find(OtpRecoveryView).vm.$emit('submit', { code });
          await global.flushPromises();

          expect(
            wrapper.find('otp-recovery-stub').attributes().isloading,
          ).toBeFalsy();
        });
      });

      describe('error', () => {
        beforeEach(() => {
          authService.disableOtpViaSms.mockRejectedValueOnce(
            new Error('error'),
          );
        });

        it('should pass error', async () => {
          expect.assertions(2);

          expect(
            wrapper.find('otp-recovery-stub').attributes().error,
          ).toBeFalsy();

          wrapper.find(OtpRecoveryView).vm.$emit('submit', { code });
          await global.flushPromises();

          expect(wrapper.find('otp-recovery-stub').attributes().error).toBe(
            i18n.t('components.recoverOtpSms.recoverError'),
          );
        });

        it('should remove error if exists before submit', async () => {
          expect.assertions(2);

          wrapper.find(OtpRecoveryView).vm.$emit('submit', { code });
          await global.flushPromises();

          expect(
            wrapper.find('otp-recovery-stub').attributes().error,
          ).toBeTruthy();

          wrapper.find(OtpRecoveryView).vm.$emit('submit', { code });
          await global.flushPromises();

          expect(
            wrapper.find('otp-recovery-stub').attributes().error,
          ).toBeFalsy();
        });
      });
    });

    describe('cancel', () => {
      it('should emit cancel event', () => {
        expect.assertions(3);

        expect(wrapper.emitted().cancel).toBeUndefined();

        wrapper.find(OtpRecoveryView).vm.$emit('cancel');

        expect(wrapper.emitted().cancel).toHaveLength(1);
        expect(wrapper.emitted().cancel[0]).toEqual([]);
      });
    });

    describe('send code', () => {
      it('should send code on mount', () => {
        expect(authService.sendOtpRecoverSms).toBeCalledTimes(1);
        expect(authService.sendOtpRecoverSms).toBeCalledWith(email);
      });

      it('should send code on event', () => {
        authService.sendOtpRecoverSms.mockClear();

        expect(authService.sendOtpRecoverSms).not.toBeCalled();

        wrapper.find(OtpRecoveryView).vm.$emit('send-code');

        expect(authService.sendOtpRecoverSms).toBeCalledTimes(1);
        expect(authService.sendOtpRecoverSms).toBeCalledWith(email);
      });

      describe('loading status', () => {
        it('should be false before sending', () => {
          expect(
            wrapper.find('otp-recovery-stub').attributes().isloading,
          ).toBeFalsy();
        });

        it('should be true while sending', () => {
          wrapper.find(OtpRecoveryView).vm.$emit('send-code');

          expect(wrapper.find('otp-recovery-stub').attributes().isloading).toBe(
            'true',
          );
        });

        it('should be false after sending', async () => {
          expect.assertions(1);

          wrapper.find(OtpRecoveryView).vm.$emit('send-code');
          await global.flushPromises();

          expect(
            wrapper.find('otp-recovery-stub').attributes().isloading,
          ).toBeFalsy();
        });
      });

      describe('error', () => {
        describe('phone exists', () => {
          beforeEach(() => {
            authService.sendOtpRecoverSms.mockRejectedValueOnce(
              new Error('error'),
            );
          });

          it('should pass error', async () => {
            expect.assertions(2);

            expect(
              wrapper.find('otp-recovery-stub').attributes().error,
            ).toBeFalsy();

            wrapper.find(OtpRecoveryView).vm.$emit('send-code');
            await global.flushPromises();

            expect(wrapper.find('otp-recovery-stub').attributes().error).toBe(
              i18n.t('components.recoverOtpSms.sendSmsError'),
            );
          });

          it('should remove error if exists before', async () => {
            expect.assertions(1);

            wrapper.find(OtpRecoveryView).vm.$emit('send-code');
            await global.flushPromises();

            wrapper.find(OtpRecoveryView).vm.$emit('send-code');
            await global.flushPromises();

            expect(
              wrapper.find('otp-recovery-stub').attributes().error,
            ).toBeFalsy();
          });
        });

        describe("phone doesn't exist", () => {
          beforeEach(() => {
            const error = new Error('error');
            error.code = 400;
            authService.sendOtpRecoverSms.mockRejectedValueOnce(error);
          });

          it('should pass prop', async () => {
            expect.assertions(2);

            expect(
              wrapper.find('otp-recovery-stub').attributes().isphoneexist,
            ).toBe('true');

            wrapper.find(OtpRecoveryView).vm.$emit('send-code');
            await global.flushPromises();

            expect(
              wrapper.find('otp-recovery-stub').attributes().isphoneexist,
            ).toBeUndefined();
          });

          it('should not pass error', async () => {
            expect.assertions(2);

            expect(
              wrapper.find('otp-recovery-stub').attributes().error,
            ).toBeFalsy();

            wrapper.find(OtpRecoveryView).vm.$emit('send-code');
            await global.flushPromises();

            expect(wrapper.find('otp-recovery-stub').attributes().error).toBe(
              '',
            );
          });
        });
      });
    });
  });
});
