import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email } from '@unitFixtures/auth';
import SignInInterface from '@/components/screens/Authenticator/modules/SignIn/SignIn.interface';
import SignInInteractor from '@/components/screens/Authenticator/modules/SignIn/SignIn.interactor';
import setupI18n from '@/locales/i18nSetup';
import { CHALLENGE_TYPES } from '@/constants';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('SignInInterface', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(SignInInterface, {
      localVue,
      i18n,
      propsData: {
        challengeType: CHALLENGE_TYPES.EMAIL_OTP,
        isPublic: false,
      },
    });
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('SignInInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render form', () => {
      expect(wrapper.find(SignInInteractor).exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit event', () => {
      expect(wrapper.emitted().complete).toBeUndefined();

      const params = {
        email,
        serverMode: false,
        isSignUp: false,
      };

      wrapper.find(SignInInteractor).vm.$emit('sign-in', params);

      expect(wrapper.emitted().complete.length).toBe(1);
      expect(wrapper.emitted().complete[0]).toEqual([params]);
    });

    it('should emit switch event', () => {
      expect(wrapper.emitted().switch).toBeUndefined();

      wrapper.find(SignInInteractor).vm.$emit('sign-up');

      expect(wrapper.emitted().switch.length).toBe(1);
      expect(wrapper.emitted().switch[0]).toEqual([{ to: 'sign-up' }]);
    });

    it('should emit social event', () => {
      expect(wrapper.emitted().social).toBeUndefined();

      wrapper.find(SignInInteractor).vm.$emit('social');

      expect(wrapper.emitted().social.length).toBe(1);
      expect(wrapper.emitted().social[0]).toEqual([]);
    });
  });
});
