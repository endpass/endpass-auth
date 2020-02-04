import { shallowMount, createLocalVue } from '@vue/test-utils';
import { regularPassword as password } from '@unitFixtures/auth';
import RegularPasswordRecoveryInterface from '@/components/screens/Authenticator/modules/RegularPasswordRecovery/RegularPasswordRecovery.interface';
import RegularPasswordRecoveryInteractor from '@/components/screens/Authenticator/modules/RegularPasswordRecovery/RegularPasswordRecovery.interactor';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('RegularPasswordRecoveryInterface', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(RegularPasswordRecoveryInterface, {
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
      expect(wrapper.name()).toBe('RegularPasswordRecoveryInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render form', () => {
      expect(wrapper.find('regular-password-recovery-stub').exists()).toBe(
        true,
      );
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit event', () => {
      expect(wrapper.emitted().complete).toBeUndefined();

      const params = { password };

      wrapper
        .find(RegularPasswordRecoveryInteractor)
        .vm.$emit('password-recovered', params);

      expect(wrapper.emitted().complete.length).toBe(1);
      expect(wrapper.emitted().complete[0]).toEqual([params]);
    });

    it('should emit switch event', () => {
      expect(wrapper.emitted().switch).toBeUndefined();

      wrapper.find(RegularPasswordRecoveryInteractor).vm.$emit('cancel');

      expect(wrapper.emitted().switch.length).toBe(1);
      expect(wrapper.emitted().switch[0]).toEqual([{ to: 'regular-password' }]);
    });
  });
});
