import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, code } from '@unitFixtures/auth';
import CodeRequestInteractor from '@/components/modules/CodeRequest/CodeRequest.interactor';
import CodeView from '@/components/modules/CodeRequest/modules/CodeView';
import setupI18n from '@/locales/i18nSetup';
import authService from '@/service/auth';
import { CHALLENGE_TYPES } from '@/constants';

const localVue = createLocalVue();
localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('CodeRequestInteractor', () => {
  let wrapper;
  const createWrapper = (options, props) =>
    shallowMount(CodeRequestInteractor, {
      localVue,
      propsData: {
        email,
        isLoading: false,
        error: '',
        challengeType: CHALLENGE_TYPES.EMAIL_OTP,
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
      expect(wrapper.name()).toBe('CodeRequestInteractor');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render form', () => {
      expect(wrapper.find(CodeView).exists()).toBe(true);
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

        wrapper.find(CodeView).vm.$emit('send-code');

        expect(authService.sendEmailCode).toBeCalledTimes(1);
        expect(authService.sendEmailCode).toBeCalledWith(email);
      });

      it('should not send code for APP_OTP', async () => {
        expect.assertions(1);

        authService.sendEmailCode.mockClear();
        wrapper = createWrapper(null, {
          challengeType: CHALLENGE_TYPES.APP_OTP,
        });

        await global.flushPromises();

        expect(authService.sendEmailCode).not.toBeCalled();
      });

      it('should send code for SMS_OTP', async () => {
        expect.assertions(2);

        authService.sendEmailCode.mockClear();
        wrapper = createWrapper(null, {
          challengeType: CHALLENGE_TYPES.SMS_OTP,
        });

        await global.flushPromises();

        expect(authService.sendEmailCode).toBeCalledTimes(1);
        expect(authService.sendEmailCode).toBeCalledWith(email);
      });

      describe('loading status', () => {
        it('should emit update when sending', async () => {
          expect.assertions(4);

          wrapper = createWrapper(null, {
            challengeType: CHALLENGE_TYPES.APP_OTP,
          });

          expect(wrapper.emitted().update).toBeUndefined();

          wrapper.find(CodeView).vm.$emit('send-code');
          await global.flushPromises();

          expect(wrapper.emitted().update.length).toBe(2);
          expect(wrapper.emitted().update[0]).toEqual([
            { error: '', isLoading: true },
          ]);
          expect(wrapper.emitted().update[1]).toEqual([{ isLoading: false }]);
        });

        it('should pass isLoading as true', () => {
          wrapper = createWrapper(null, {
            isLoading: true,
          });

          expect(wrapper.find(CodeView).attributes().isloading).toBeTruthy();
        });

        it('should pass isLoading as false', () => {
          wrapper = createWrapper(null, {
            isLoading: false,
          });

          expect(wrapper.find(CodeView).attributes().isloading).toBeFalsy();
        });
      });

      describe('error', () => {
        beforeEach(() => {
          wrapper = createWrapper(null, {
            challengeType: CHALLENGE_TYPES.APP_OTP,
          });
          authService.sendEmailCode.mockRejectedValueOnce(new Error('error'));
        });

        it('should emit error', async () => {
          expect.assertions(4);

          wrapper.find(CodeView).vm.$emit('send-code');
          await global.flushPromises();

          expect(wrapper.emitted().update.length).toBe(3);
          expect(wrapper.emitted().update[0]).toEqual([
            { error: '', isLoading: true },
          ]);
          expect(wrapper.emitted().update[1]).toEqual([
            { error: i18n.t('components.code.sendError') },
          ]);
          expect(wrapper.emitted().update[2]).toEqual([{ isLoading: false }]);
        });
      });
    });

    describe('recover', () => {
      it('should emit recover event', () => {
        expect(wrapper.emitted().recover).toBeUndefined();

        wrapper.find(CodeView).vm.$emit('recover');

        expect(wrapper.emitted().recover).toHaveLength(1);
        expect(wrapper.emitted().recover[0]).toEqual([]);
      });

      it('should not emit recover event if loading', () => {
        wrapper = createWrapper(null, {
          isLoading: true,
        });
        expect(wrapper.emitted().recover).toBeUndefined();

        wrapper.find(CodeView).vm.$emit('recover');

        expect(wrapper.emitted().recover).toBeUndefined();
      });
    });

    describe('submit', () => {
      it('should emit submit event', () => {
        expect(wrapper.emitted().submit).toBeUndefined();

        wrapper.find(CodeView).vm.$emit('submit', { code });

        expect(wrapper.emitted().submit.length).toBe(1);
        expect(wrapper.emitted().submit[0]).toEqual([{ code }]);
      });

      it('should not emit submit event if loading', () => {
        wrapper = createWrapper(null, {
          isLoading: true,
        });
        expect(wrapper.emitted().submit).toBeUndefined();

        wrapper.find(CodeView).vm.$emit('submit', { code });

        expect(wrapper.emitted().submit).toBeUndefined();
      });
    });
  });
});
