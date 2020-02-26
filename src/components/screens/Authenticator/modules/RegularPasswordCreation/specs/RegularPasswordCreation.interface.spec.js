import { shallowMount, createLocalVue } from '@vue/test-utils';
import { regularPassword as password } from '@unitFixtures/auth';
import RegularPasswordCreationInterface from '@/components/screens/Authenticator/modules/RegularPasswordCreation/RegularPasswordCreation.interface';
import RegularPasswordCreationInteractor from '@/components/screens/Authenticator/modules/RegularPasswordCreation/RegularPasswordCreation.interactor';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('RegularPasswordCreationInterface', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(RegularPasswordCreationInterface, {
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
      expect(wrapper.name()).toBe('RegularPasswordCreationInterface');
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
    it('should emit event', () => {
      expect(wrapper.emitted().complete).toBeUndefined();

      const params = { password };

      wrapper
        .find(RegularPasswordCreationInteractor)
        .vm.$emit('password-created', params);

      expect(wrapper.emitted().complete.length).toBe(1);
      expect(wrapper.emitted().complete[0]).toEqual([params]);
    });
  });
});
