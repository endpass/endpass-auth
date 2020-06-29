import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, regularPassword as password } from '@unitFixtures/auth';
import SignUpInterface from '@/components/screens/Authenticator/modules/SignUp/SignUp.interface';
import SignUpInteractor from '@/components/screens/Authenticator/modules/SignUp/SignUp.interactor';
import setupI18n from '@/locales/i18nSetup';
import { IDENTITY_MODE } from '@/constants';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('SignUpInterface', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(SignUpInterface, {
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
      expect(wrapper.name()).toBe('SignUpInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render form', () => {
      expect(wrapper.find('sign-up-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit event', () => {
      expect(wrapper.emitted().complete).toBeUndefined();

      const params = {
        email,
        serverMode: {
          type: IDENTITY_MODE.DEFAULT,
          serverUrl: undefined,
        },
        password,
        isSignUp: true,
        isSocial: false,
      };

      wrapper.find(SignUpInteractor).vm.$emit('sign-up', params);

      expect(wrapper.emitted().complete.length).toBe(1);
      expect(wrapper.emitted().complete[0]).toEqual([params]);
    });

    it('should emit switch event', () => {
      expect(wrapper.emitted().switch).toBeUndefined();

      wrapper.find(SignUpInteractor).vm.$emit('sign-in');

      expect(wrapper.emitted().switch.length).toBe(1);
      expect(wrapper.emitted().switch[0]).toEqual([{ to: 'sign-in' }]);
    });

    it('should emit social event', () => {
      expect(wrapper.emitted().social).toBeUndefined();

      wrapper.find(SignUpInteractor).vm.$emit('social');

      expect(wrapper.emitted().social.length).toBe(1);
      expect(wrapper.emitted().social[0]).toEqual([]);
    });
  });
});
