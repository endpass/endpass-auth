import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, regularPassword as password } from '@unitFixtures/auth';
import CodeInterface from '@/components/screens/Authenticator/modules/Code/Code.interface';
import CodeInteractor from '@/components/screens/Authenticator/modules/Code/Code.interactor';
import setupI18n from '@/locales/i18nSetup';
import { CHALLENGE_TYPES } from '@/constants';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('CodeInterface', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(CodeInterface, {
      localVue,
      i18n,
      propsData: {
        password,
        email,
        challengeType: CHALLENGE_TYPES.EMAIL_OTP,
        isSignUp: false,
      },
    });
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('CodeInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render code form', () => {
      expect(wrapper.find('code-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit complete event', () => {
      expect(wrapper.emitted().complete).toBeUndefined();

      wrapper.find(CodeInteractor).vm.$emit('complete');

      expect(wrapper.emitted().complete.length).toBe(1);
      expect(wrapper.emitted().complete[0]).toEqual([]);
    });

    it('should emit switch event', () => {
      expect(wrapper.emitted().switch).toBeUndefined();

      wrapper.find(CodeInteractor).vm.$emit('recover');

      expect(wrapper.emitted().switch.length).toBe(1);
      expect(wrapper.emitted().switch[0]).toEqual([{ to: 'recovery-code' }]);
    });
  });
});
