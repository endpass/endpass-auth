import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, regularPassword as password, code } from '@unitFixtures/auth';
import CodeInteractor from '@/components/screens/Authenticator/modules/Code/Code.interactor';
import Code from '@/components/modules/Code';
import setupI18n from '@/locales/i18nSetup';
import authService from '@/service/auth';
import { CHALLENGE_TYPES } from '@/constants';

const localVue = createLocalVue();
localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('CodeInteractor', () => {
  let wrapper;
  const challengeType = CHALLENGE_TYPES.EMAIL_OTP;

  const createWrapper = (options, props) =>
    shallowMount(CodeInteractor, {
      localVue,
      propsData: {
        email,
        password,
        challengeType,
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
      expect(wrapper.name()).toBe('CodeInteractor');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render form', () => {
      expect(wrapper.find('code-stub').exists()).toBe(true);
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

        wrapper.find(Code).vm.$emit('submit', { code });

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

        wrapper.find(Code).vm.$emit('submit', { code });

        expect(authService.authWithCode).toBeCalledTimes(1);
        expect(authService.authWithCode).toBeCalledWith({
          ...defaultServiceParams,
          isSignUp: true,
        });
      });

      it('should handle submit event with remember prop', async () => {
        expect.assertions(3);

        expect(authService.authWithCode).not.toBeCalled();

        wrapper.find(Code).vm.$emit('submit', { code, isRemember: true });

        expect(authService.authWithCode).toBeCalledTimes(1);
        expect(authService.authWithCode).toBeCalledWith({
          ...defaultServiceParams,
          isRemember: true,
        });
      });

      it('should not handle submit event when loading status true', async () => {
        expect.assertions(2);

        expect(authService.authWithCode).not.toBeCalled();

        wrapper.find(Code).vm.$emit('submit', { code });
        wrapper.find(Code).vm.$emit('submit', { code });

        expect(authService.authWithCode).toBeCalledTimes(1);
      });

      describe('loading status', () => {
        it('should be false before submit', () => {
          expect(wrapper.find('code-stub').attributes().isloading).toBeFalsy();
        });

        it('should be true after submit', () => {
          wrapper.find(Code).vm.$emit('submit', { code });

          expect(wrapper.find('code-stub').attributes().isloading).toBe('true');
        });

        it('should be false after handling submit', async () => {
          expect.assertions(1);

          wrapper.find(Code).vm.$emit('submit', { code });
          await global.flushPromises();

          expect(wrapper.find('code-stub').attributes().isloading).toBeFalsy();
        });
      });

      describe('error', () => {
        beforeEach(() => {
          authService.authWithCode.mockRejectedValueOnce(new Error('error'));
        });

        it('should pass error', async () => {
          expect.assertions(2);

          expect(wrapper.find('code-stub').attributes().error).toBeFalsy();

          wrapper.find(Code).vm.$emit('submit', { code });
          await global.flushPromises();

          expect(wrapper.find('code-stub').attributes().error).toBe(
            i18n.t('components.code.authFailed'),
          );
        });

        it('should remove error if exists before submit', async () => {
          expect.assertions(1);

          wrapper.find(Code).vm.$emit('submit', { code });
          await global.flushPromises();

          wrapper.find(Code).vm.$emit('submit', { code });

          expect(wrapper.find('code-stub').attributes().error).toBeFalsy();
        });
      });
    });

    describe('recover', () => {
      it('should emit recover event', () => {
        expect(wrapper.emitted().recover).toBeUndefined();

        wrapper.find(Code).vm.$emit('recover');

        expect(wrapper.emitted().recover.length).toBe(1);
        expect(wrapper.emitted().recover[0]).toEqual([]);
      });

      it('should not emit recover event while loading', () => {
        wrapper.find(Code).vm.$emit('submit', { code });
        wrapper.find(Code).vm.$emit('recover');

        expect(wrapper.emitted().recover).toBeUndefined();
      });
    });
  });
});
