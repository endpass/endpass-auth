import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, regularPassword as password } from '@unitFixtures/auth';
import CodeRequestInterface from '@/components/screens/Authenticator/modules/CodeRequest/CodeRequest.interface';
import CodeRequestInteractor from '@/components/screens/Authenticator/modules/CodeRequest/CodeRequest.interactor';
import setupI18n from '@/locales/i18nSetup';
import { CHALLENGE_TYPES } from '@/constants';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('CodeRequestInterface', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(CodeRequestInterface, {
      localVue,
      i18n,
      propsData: {
        password,
        email,
        challengeType: CHALLENGE_TYPES.EMAIL_OTP,
        isSignUp: false,
        isRemember: false,
      },
    });
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('CodeRequestInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render code form', () => {
      expect(wrapper.find(CodeRequestInteractor).exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit complete event', () => {
      expect(wrapper.emitted().complete).toBeUndefined();

      wrapper.find(CodeRequestInteractor).vm.$emit('complete');

      expect(wrapper.emitted().complete.length).toBe(1);
      expect(wrapper.emitted().complete[0]).toEqual([]);
    });

    it('should emit switch event', () => {
      expect(wrapper.emitted().switch).toBeUndefined();

      wrapper.find(CodeRequestInteractor).vm.$emit('recover');

      expect(wrapper.emitted().switch.length).toBe(1);
      expect(wrapper.emitted().switch[0]).toEqual([{ to: 'recovery-code' }]);
    });
  });
});
