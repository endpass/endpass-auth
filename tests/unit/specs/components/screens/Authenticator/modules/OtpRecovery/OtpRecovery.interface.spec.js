import { shallowMount, createLocalVue } from '@vue/test-utils';
import OtpRecoveryInterface from '@/components/screens/Authenticator/modules/OtpRecovery/OtpRecovery.interface';
import OtpRecoveryInteractor from '@/components/screens/Authenticator/modules/OtpRecovery/OtpRecovery.interactor';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('OtpRecoveryInterface', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(OtpRecoveryInterface, {
      localVue,
      i18n,
      propsData: {
        password: '',
        email: '',
      },
    });
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('OtpRecoveryInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render otp form', () => {
      expect(wrapper.find('otp-recovery-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit complete event', () => {
      expect(wrapper.emitted().complete).toBeUndefined();

      wrapper.find(OtpRecoveryInteractor).vm.$emit('otp-recovered');

      expect(wrapper.emitted().complete.length).toBe(1);
      expect(wrapper.emitted().complete[0]).toEqual([]);
    });

    it('should emit switch event', () => {
      expect(wrapper.emitted().switch).toBeUndefined();

      wrapper.find(OtpRecoveryInteractor).vm.$emit('cancel');

      expect(wrapper.emitted().switch.length).toBe(1);
      expect(wrapper.emitted().switch[0]).toEqual([{ to: 'app-code' }]);
    });
  });
});
