import { shallowMount, createLocalVue } from '@vue/test-utils';
import { regularPassword as password } from '@unitFixtures/auth';
import RegularPasswordInterface from '@/components/screens/Authenticator/modules/RegularPassword/RegularPassword.interface';
import RegularPasswordInteractor from '@/components/screens/Authenticator/modules/RegularPassword/RegularPassword.interactor';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('RegularPasswordInterface', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(RegularPasswordInterface, {
      localVue,
      i18n,
      propsData: {
        isSignUp: false,
        isRemembered: false,
        email: '',
      },
    });
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('RegularPasswordInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render pasword form', () => {
      expect(wrapper.find('regular-password-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit complete event', () => {
      expect(wrapper.emitted().complete).toBeUndefined();

      wrapper.find(RegularPasswordInteractor).vm.$emit('submit', { password });

      expect(wrapper.emitted().complete.length).toBe(1);
      expect(wrapper.emitted().complete[0]).toEqual([{ password }]);
    });

    it('should emit switch event', () => {
      expect(wrapper.emitted().switch).toBeUndefined();

      wrapper.find(RegularPasswordInteractor).vm.$emit('recover');

      expect(wrapper.emitted().switch.length).toBe(1);
      expect(wrapper.emitted().switch[0]).toEqual([
        { to: 'regular-password-recovery' },
      ]);
    });
  });
});
