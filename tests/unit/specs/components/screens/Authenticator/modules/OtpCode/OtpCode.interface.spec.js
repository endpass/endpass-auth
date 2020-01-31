import { shallowMount, createLocalVue } from '@vue/test-utils';
import OtpCodeInterface from '@/components/screens/Authenticator/modules/OtpCode/OtpCode.interface';
import OtpCodeInteractor from '@/components/screens/Authenticator/modules/OtpCode/OtpCode.interactor';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('OtpCodeInterface', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(OtpCodeInterface, {
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
      expect(wrapper.name()).toBe('OtpCodeInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render otp form', () => {
      expect(wrapper.find('otp-code-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit complete event', () => {
      expect(wrapper.emitted().complete).toBeUndefined();

      wrapper.find(OtpCodeInteractor).vm.$emit('auth');

      expect(wrapper.emitted().complete.length).toBe(1);
      expect(wrapper.emitted().complete[0]).toEqual([]);
    });

    it('should emit switch event', () => {
      expect(wrapper.emitted().switch).toBeUndefined();

      wrapper.find(OtpCodeInteractor).vm.$emit('recover');

      expect(wrapper.emitted().switch.length).toBe(1);
      expect(wrapper.emitted().switch[0]).toEqual([{ to: 'otp-recovery' }]);
    });
  });
});
