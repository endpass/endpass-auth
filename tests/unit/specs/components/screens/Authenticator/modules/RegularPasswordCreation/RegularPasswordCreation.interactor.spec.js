import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, regularPassword as password, code } from '@unitFixtures/auth';
import RegularPasswordCreationInteractor from '@/components/screens/Authenticator/modules/RegularPasswordCreation/RegularPasswordCreation.interactor';
import RegularPasswordCreationView from '@/components/screens/Authenticator/modules/RegularPasswordCreation/RegularPasswordCreation.view';
import setupI18n from '@/locales/i18nSetup';
import identityService from '@/service/identity';

const localVue = createLocalVue();
localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('RegularPasswordCreationInteractor', () => {
  let wrapper;
  const createWrapper = (options, props) =>
    shallowMount(RegularPasswordCreationInteractor, {
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
      expect(wrapper.name()).toBe('RegularPasswordCreationInteractor');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render form', () => {
      expect(wrapper.find('regular-password-creation-stub').exists()).toBe(
        true,
      );
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    describe('send code', () => {
      it('should send code on mount', () => {
        expect(identityService.resetRegularPassword).toBeCalledTimes(1);
        expect(identityService.resetRegularPassword).toBeCalledWith({ email });
      });

      it('should send code on event', () => {
        identityService.resetRegularPassword.mockClear();

        expect(identityService.resetRegularPassword).not.toBeCalled();

        wrapper.find(RegularPasswordCreationView).vm.$emit('send-code');

        expect(identityService.resetRegularPassword).toBeCalledTimes(1);
        expect(identityService.resetRegularPassword).toBeCalledWith({ email });
      });

      it('should not send code when loading', () => {
        identityService.resetRegularPassword.mockClear();

        expect(identityService.resetRegularPassword).not.toBeCalled();

        wrapper.find(RegularPasswordCreationView).vm.$emit('send-code');
        wrapper.find(RegularPasswordCreationView).vm.$emit('send-code');

        expect(identityService.resetRegularPassword).toBeCalledTimes(1);
        expect(identityService.resetRegularPassword).toBeCalledWith({ email });
      });

      describe('loading status', () => {
        it('should be false before sending', () => {
          expect(
            wrapper.find('regular-password-creation-stub').attributes()
              .isloading,
          ).toBeFalsy();
        });

        it('should be true while sending', () => {
          wrapper.find(RegularPasswordCreationView).vm.$emit('send-code');

          expect(
            wrapper.find('regular-password-creation-stub').attributes()
              .isloading,
          ).toBe('true');
        });

        it('should be false after sending', async () => {
          expect.assertions(1);

          wrapper.find(RegularPasswordCreationView).vm.$emit('send-code');
          await global.flushPromises();

          expect(
            wrapper.find('regular-password-creation-stub').attributes()
              .isloading,
          ).toBeFalsy();
        });
      });

      describe('error', () => {
        beforeEach(() => {
          identityService.resetRegularPassword.mockRejectedValueOnce(
            new Error('error'),
          );
        });

        it('should pass error', async () => {
          expect.assertions(2);

          expect(
            wrapper.find('regular-password-creation-stub').attributes().error,
          ).toBeFalsy();

          wrapper.find(RegularPasswordCreationView).vm.$emit('send-code');
          await global.flushPromises();

          expect(
            wrapper.find('regular-password-creation-stub').attributes().error,
          ).toBe(i18n.t('components.createPassword.sendError'));
        });

        it('should remove error if exists before', async () => {
          expect.assertions(1);

          wrapper.find(RegularPasswordCreationView).vm.$emit('send-code');
          await global.flushPromises();

          wrapper.find(RegularPasswordCreationView).vm.$emit('send-code');

          expect(
            wrapper.find('regular-password-creation-stub').attributes().error,
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
          .find(RegularPasswordCreationView)
          .vm.$emit('submit', { password, code });

        expect(identityService.confirmResetRegularPassword).toBeCalledTimes(1);
        expect(identityService.confirmResetRegularPassword).toBeCalledWith({
          ...defaultServiceParams,
        });
      });

      it('should not handle submit event when loading status true', async () => {
        expect.assertions(1);

        wrapper.find(RegularPasswordCreationView).vm.$emit('submit', { code });
        wrapper.find(RegularPasswordCreationView).vm.$emit('submit', { code });

        expect(identityService.confirmResetRegularPassword).toBeCalledTimes(1);
      });

      it('should emit event', async () => {
        expect.assertions(3);

        expect(wrapper.emitted()['password-created']).toBeUndefined();

        wrapper
          .find(RegularPasswordCreationView)
          .vm.$emit('submit', { password, code });

        await global.flushPromises();

        expect(wrapper.emitted()['password-created'].length).toBe(1);
        expect(wrapper.emitted()['password-created'][0]).toEqual([
          { password },
        ]);
      });

      describe('loading status', () => {
        it('should be false before submit', () => {
          expect(
            wrapper.find('regular-password-creation-stub').attributes()
              .isloading,
          ).toBeFalsy();
        });

        it('should be true after submit', () => {
          wrapper
            .find(RegularPasswordCreationView)
            .vm.$emit('submit', { code });

          expect(
            wrapper.find('regular-password-creation-stub').attributes()
              .isloading,
          ).toBe('true');
        });

        it('should be false after handling submit', async () => {
          expect.assertions(1);

          wrapper
            .find(RegularPasswordCreationView)
            .vm.$emit('submit', { code });
          await global.flushPromises();

          expect(
            wrapper.find('regular-password-creation-stub').attributes()
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
            wrapper.find('regular-password-creation-stub').attributes().error,
          ).toBeFalsy();

          wrapper
            .find(RegularPasswordCreationView)
            .vm.$emit('submit', { code });
          await global.flushPromises();

          expect(
            wrapper.find('regular-password-creation-stub').attributes().error,
          ).toBe(i18n.t('components.createPassword.confirmError'));
        });

        it('should remove error if exists before submit', async () => {
          expect.assertions(1);

          wrapper
            .find(RegularPasswordCreationView)
            .vm.$emit('submit', { code });
          await global.flushPromises();

          wrapper
            .find(RegularPasswordCreationView)
            .vm.$emit('submit', { code });

          expect(
            wrapper.find('regular-password-creation-stub').attributes().error,
          ).toBeFalsy();
        });
      });
    });
  });
});
