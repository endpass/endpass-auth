import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, regularPassword as password } from '@unitFixtures/auth';
import SignUpInteractor from '@/components/screens/Authenticator/modules/SignUp/SignUp.interactor';
import SignUpView from '@/components/screens/Authenticator/modules/SignUp/SignUp.view';
import setupI18n from '@/locales/i18nSetup';
import authService from '@/service/auth';
import identityService from '@/service/identity';

const localVue = createLocalVue();
localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('SignUpInteractor', () => {
  let wrapper;
  const createWrapper = (options, props) =>
    shallowMount(SignUpInteractor, {
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
      expect(wrapper.name()).toBe('SignUpInteractor');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render form', () => {
      expect(wrapper.find('sign-up-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit sign-up event', () => {
      expect(wrapper.emitted()['sign-in']).toBeUndefined();

      wrapper.find(SignUpView).vm.$emit('sign-in');

      expect(wrapper.emitted()['sign-in'].length).toBe(1);
      expect(wrapper.emitted()['sign-in'][0]).toEqual([]);
    });

    describe('handle social event', () => {
      it('should call service', () => {
        expect(authService.waitLogin).not.toBeCalled();

        wrapper.find(SignUpView).vm.$emit('social');

        expect(authService.waitLogin).toBeCalledTimes(1);
        expect(authService.waitLogin).toBeCalledWith();
      });

      it('should emit event', async () => {
        expect.assertions(2);

        expect(wrapper.emitted().social).toBeUndefined();

        wrapper.find(SignUpView).vm.$emit('social');
        await global.flushPromises();

        expect(wrapper.emitted().social).toHaveLength(1);
      });

      describe('loading status', () => {
        it('should be false before event', () => {
          expect(
            wrapper.find('sign-up-stub').attributes().isloading,
          ).toBeFalsy();
        });

        it('should be true while waiting', () => {
          wrapper.find(SignUpView).vm.$emit('social');

          expect(wrapper.find('sign-up-stub').attributes().isloading).toBe(
            'true',
          );
        });

        it('should be false after sending', async () => {
          expect.assertions(1);

          wrapper.find(SignUpView).vm.$emit('social');
          await global.flushPromises();

          expect(
            wrapper.find('sign-up-stub').attributes().isloading,
          ).toBeFalsy();
        });
      });
    });

    describe('submit', () => {
      const defaultEventParams = {
        email,
        password,
      };

      describe('default auth mode', () => {
        it('should emit sign-in event', async () => {
          expect.assertions(3);

          const defaultParams = {
            ...defaultEventParams,
            isSignUp: true,
          };

          identityService.checkRegularPassword.mockResolvedValueOnce(true);

          expect(wrapper.emitted()['sign-up']).toBeUndefined();

          wrapper.find(SignUpView).vm.$emit('submit', defaultEventParams);
          await global.flushPromises();

          expect(wrapper.emitted()['sign-up'].length).toBe(1);
          expect(wrapper.emitted()['sign-up'][0]).toEqual([defaultParams]);
        });

        it('should get challenge type', () => {
          expect.assertions(3);

          expect(authService.getAuthChallenge).not.toBeCalled();

          wrapper.find(SignUpView).vm.$emit('submit', defaultEventParams);

          expect(authService.getAuthChallenge).toBeCalledTimes(1);
          expect(authService.getAuthChallenge).toBeCalledWith(email);
        });
      });

      it('should not handle submit event when loading status true', async () => {
        expect.assertions(1);

        wrapper.find(SignUpView).vm.$emit('submit', defaultEventParams);
        wrapper.find(SignUpView).vm.$emit('submit', defaultEventParams);
        await global.flushPromises();

        expect(wrapper.emitted()['sign-up'].length).toBe(1);
      });

      describe('loading status', () => {
        it('should be false before submit', () => {
          expect(
            wrapper.find('sign-up-stub').attributes().isloading,
          ).toBeFalsy();
        });

        it('should be true after submit', () => {
          wrapper.find(SignUpView).vm.$emit('submit', defaultEventParams);

          expect(wrapper.find('sign-up-stub').attributes().isloading).toBe(
            'true',
          );
        });

        it('should be false after handling submit', async () => {
          expect.assertions(1);

          wrapper.find(SignUpView).vm.$emit('submit', defaultEventParams);
          await global.flushPromises();

          expect(
            wrapper.find('sign-up-stub').attributes().isloading,
          ).toBeFalsy();
        });
      });

      describe('error', () => {
        beforeEach(() => {
          authService.getAuthChallenge.mockRejectedValueOnce(
            new Error('error'),
          );
        });

        it('should pass error', async () => {
          expect.assertions(2);

          expect(wrapper.find('sign-up-stub').attributes().error).toBeFalsy();

          wrapper.find(SignUpView).vm.$emit('submit', defaultEventParams);
          await global.flushPromises();

          expect(wrapper.find('sign-up-stub').attributes().error).toBe(
            i18n.t('components.compositeAuth.authFailed'),
          );
        });

        it('should remove error if exists before submit', async () => {
          expect.assertions(1);

          wrapper.find(SignUpView).vm.$emit('submit', defaultEventParams);
          await global.flushPromises();

          wrapper.find(SignUpView).vm.$emit('submit', defaultEventParams);

          expect(wrapper.find('sign-up-stub').attributes().error).toBeFalsy();
        });
      });
    });
  });
});
