import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email } from '@unitFixtures/auth';
import ProviderInterface from '@/components/screens/public/LoginProvider/modules/Provider/Provider.interface';
import ProviderContainer from '@/components/screens/public/LoginProvider/modules/Provider/Provider.container';
import setupI18n from '@/locales/i18nSetup';
import { CHALLENGE_TYPES } from '@/constants';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('ProviderInterface', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(ProviderInterface, {
      localVue,
      i18n,
      propsData: {
        email,
        oauthLoginChallenge: '',
        error: '',
        isLoading: false,
        challengeType: CHALLENGE_TYPES.EMAIL_OTP,
      },
      sync: false,
    });
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('ProviderInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render code form', () => {
      expect(wrapper.find(ProviderContainer).exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit complete event', () => {
      expect(wrapper.emitted().complete).toBeUndefined();
      const redirect = 'redirect';

      wrapper.find(ProviderContainer).vm.$emit('complete', { redirect });

      expect(wrapper.emitted().complete).toHaveLength(1);
      expect(wrapper.emitted().complete[0]).toEqual([{ redirect }]);
    });

    it('should emit close', () => {
      expect(wrapper.emitted().close).toBeUndefined();

      wrapper.find(ProviderContainer).vm.$emit('close');

      expect(wrapper.emitted().close).toHaveLength(1);
      expect(wrapper.emitted().close).toEqual([[]]);
    });
  });
});
