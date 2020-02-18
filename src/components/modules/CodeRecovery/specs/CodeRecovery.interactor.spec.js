import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, code } from '@unitFixtures/auth';
import CodeRecoveryInteractor from '@/components/modules/CodeRecovery/CodeRecovery.interactor';
import RecoveryPhone from '@/components/modules/CodeRecovery/modules/RecoveryPhone';
import setupI18n from '@/locales/i18nSetup';
import authService from '@/service/auth';

const localVue = createLocalVue();
localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('CodeRecoveryInteractor', () => {
  let wrapper;
  const createWrapper = () =>
    shallowMount(CodeRecoveryInteractor, {
      localVue,
      propsData: {
        email,
      },
      i18n,
    });

  beforeEach(async () => {
    jest.clearAllMocks();

    wrapper = createWrapper();
    await global.flushPromises();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('CodeRecoveryInteractor');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render form', () => {
      expect(wrapper.find(RecoveryPhone).exists()).toBe(true);
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

        wrapper.find(RecoveryPhone).vm.$emit('submit', { code });

        expect(authService.disableOtpViaSms).toBeCalledTimes(1);
        expect(authService.disableOtpViaSms).toBeCalledWith({
          ...defaultServiceParams,
        });
      });

      it('should emit event after handling submit', async () => {
        expect.assertions(3);

        expect(wrapper.emitted().recovered).toBeUndefined();

        wrapper.find(RecoveryPhone).vm.$emit('submit', { code });
        await global.flushPromises();

        expect(wrapper.emitted().recovered).toHaveLength(1);
        expect(wrapper.emitted().recovered[0]).toEqual([]);
      });

      it('should not handle submit event when loading status true', async () => {
        expect.assertions(2);

        expect(authService.disableOtpViaSms).not.toBeCalled();

        wrapper.find(RecoveryPhone).vm.$emit('submit', { code });
        wrapper.find(RecoveryPhone).vm.$emit('submit', { code });

        expect(authService.disableOtpViaSms).toBeCalledTimes(1);
      });

      describe('loading status', () => {
        it('should be false before submit', () => {
          expect(
            wrapper.find(RecoveryPhone).attributes().isloading,
          ).toBeFalsy();
        });

        it('should be true after submit', () => {
          wrapper.find(RecoveryPhone).vm.$emit('submit', { code });

          expect(wrapper.find(RecoveryPhone).attributes().isloading).toBe(
            'true',
          );
        });

        it('should be false after handling submit', async () => {
          expect.assertions(1);

          wrapper.find(RecoveryPhone).vm.$emit('submit', { code });
          await global.flushPromises();

          expect(
            wrapper.find(RecoveryPhone).attributes().isloading,
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

          expect(wrapper.find(RecoveryPhone).attributes().error).toBeFalsy();

          wrapper.find(RecoveryPhone).vm.$emit('submit', { code });
          await global.flushPromises();

          expect(wrapper.find(RecoveryPhone).attributes().error).toBe(
            i18n.t('components.recoverOtpSms.recoverError'),
          );
        });

        it('should remove error if exists before submit', async () => {
          expect.assertions(2);

          wrapper.find(RecoveryPhone).vm.$emit('submit', { code });
          await global.flushPromises();

          expect(wrapper.find(RecoveryPhone).attributes().error).toBeTruthy();

          wrapper.find(RecoveryPhone).vm.$emit('submit', { code });
          await global.flushPromises();

          expect(wrapper.find(RecoveryPhone).attributes().error).toBeFalsy();
        });
      });
    });

    describe('cancel', () => {
      it('should emit cancel event', () => {
        expect.assertions(3);

        expect(wrapper.emitted().cancel).toBeUndefined();

        wrapper.find(RecoveryPhone).vm.$emit('cancel');

        expect(wrapper.emitted()['recovery-cancel']).toHaveLength(1);
        expect(wrapper.emitted()['recovery-cancel'][0]).toEqual([]);
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

        wrapper.find(RecoveryPhone).vm.$emit('send-code');

        expect(authService.sendOtpRecoverSms).toBeCalledTimes(1);
        expect(authService.sendOtpRecoverSms).toBeCalledWith(email);
      });

      describe('loading status', () => {
        it('should be false before sending', () => {
          expect(
            wrapper.find(RecoveryPhone).attributes().isloading,
          ).toBeFalsy();
        });

        it('should be true while sending', () => {
          wrapper.find(RecoveryPhone).vm.$emit('send-code');

          expect(wrapper.find(RecoveryPhone).attributes().isloading).toBe(
            'true',
          );
        });

        it('should be false after sending', async () => {
          expect.assertions(1);

          wrapper.find(RecoveryPhone).vm.$emit('send-code');
          await global.flushPromises();

          expect(
            wrapper.find(RecoveryPhone).attributes().isloading,
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

            expect(wrapper.find(RecoveryPhone).attributes().error).toBeFalsy();

            wrapper.find(RecoveryPhone).vm.$emit('send-code');
            await global.flushPromises();

            expect(wrapper.find(RecoveryPhone).attributes().error).toBe(
              i18n.t('components.recoverOtpSms.sendSmsError'),
            );
          });

          it('should remove error if exists before', async () => {
            expect.assertions(1);

            wrapper.find(RecoveryPhone).vm.$emit('send-code');
            await global.flushPromises();

            wrapper.find(RecoveryPhone).vm.$emit('send-code');
            await global.flushPromises();

            expect(wrapper.find(RecoveryPhone).attributes().error).toBeFalsy();
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

            expect(wrapper.find(RecoveryPhone).attributes().isphoneexist).toBe(
              'true',
            );

            wrapper.find(RecoveryPhone).vm.$emit('send-code');
            await global.flushPromises();

            expect(
              wrapper.find(RecoveryPhone).attributes().isphoneexist,
            ).toBeUndefined();
          });

          it('should not pass error', async () => {
            expect.assertions(2);

            expect(wrapper.find(RecoveryPhone).attributes().error).toBeFalsy();

            wrapper.find(RecoveryPhone).vm.$emit('send-code');
            await global.flushPromises();

            expect(wrapper.find(RecoveryPhone).attributes().error).toBe('');
          });
        });
      });
    });
  });
});
