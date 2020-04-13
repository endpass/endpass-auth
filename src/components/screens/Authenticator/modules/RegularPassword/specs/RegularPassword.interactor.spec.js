import { shallowMount, createLocalVue } from '@vue/test-utils';
import { regularPassword as password } from '@unitFixtures/auth';
import VeeValidate from 'vee-validate';
import RegularPassword from '@/components/screens/Authenticator/modules/RegularPassword/RegularPassword.interactor';
import RegularPasswordView from '@/components/screens/Authenticator/modules/RegularPassword/RegularPassword.view';
import setupI18n from '@/locales/i18nSetup';
import authService from '@/service/auth';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(VeeValidate);

describe('RegularPassword', () => {
  let wrapper;

  const defaultProps = {
    email: 'email',
    isSignUp: false,
    isRemembered: false,
  };

  const createWrapper = options => {
    return shallowMount(RegularPassword, {
      provide: {
        theme: 'default',
      },
      propsData: defaultProps,
      localVue,
      sync: false,
      i18n,
      ...options,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('RegularPasswordInteractor');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should submit as not remembered', async () => {
      expect.assertions(4);

      expect(wrapper.emitted().submit).toBeUndefined();

      wrapper.find(RegularPasswordView).vm.$emit('submit', { password });

      await global.flushPromises();

      expect(authService.authWithCode).not.toBeCalled();

      expect(wrapper.emitted().submit.length).toBe(1);
      expect(wrapper.emitted().submit[0]).toEqual([
        {
          password,
        },
      ]);
    });

    it('should auth with code as remembered', async () => {
      expect.assertions(2);

      wrapper = createWrapper({
        propsData: {
          ...defaultProps,
          isRemembered: true,
        },
      });

      wrapper.find(RegularPasswordView).vm.$emit('submit', { password });

      await global.flushPromises();

      expect(authService.authWithCode).toBeCalledTimes(1);
      expect(authService.authWithCode).toBeCalledWith({
        isSignUp: defaultProps.isSignUp,
        email: defaultProps.email,
        password,
        isRemember: true,
      });
    });

    it('should submit as remembered', async () => {
      expect.assertions(3);

      wrapper = createWrapper({
        propsData: {
          ...defaultProps,
          isRemembered: true,
        },
      });

      expect(wrapper.emitted().submit).toBeUndefined();

      wrapper.find(RegularPasswordView).vm.$emit('submit', { password });

      await global.flushPromises();

      expect(wrapper.emitted().submit.length).toBe(1);
      expect(wrapper.emitted().submit[0]).toEqual([
        {
          password,
        },
      ]);
    });

    it('should not submit if error', async () => {
      expect.assertions(1);

      wrapper = createWrapper({
        propsData: {
          ...defaultProps,
          isRemembered: true,
        },
      });

      authService.authWithCode.mockRejectedValueOnce(new Error('error'));
      wrapper.find(RegularPasswordView).vm.$emit('submit', { password });

      await global.flushPromises();

      expect(wrapper.emitted().submit).toBeUndefined();
    });

    it('should pass error', async () => {
      expect.assertions(2);

      wrapper = createWrapper({
        propsData: {
          ...defaultProps,
          isRemembered: true,
        },
      });

      expect(wrapper.find(RegularPasswordView).props().error).toBe('');

      authService.authWithCode.mockRejectedValueOnce(new Error('error'));
      wrapper.find(RegularPasswordView).vm.$emit('submit', { password });

      await global.flushPromises();

      expect(wrapper.find(RegularPasswordView).props().error).toBe(
        wrapper.vm.$t('components.code.authFailed'),
      );
    });

    it('should emit recover event', () => {
      expect(wrapper.emitted().recover).toBeUndefined();

      wrapper.find(RegularPasswordView).vm.$emit('recover');

      expect(wrapper.emitted().recover).toHaveLength(1);
      expect(wrapper.emitted().recover[0]).toEqual([]);
    });
  });
});
