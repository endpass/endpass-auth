import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email } from '@unitFixtures/auth';
import ProviderContainer from '@/components/screens/public/LoginProvider/modules/Provider/Provider.container';
import Code from '@/components/screens/public/LoginProvider/modules/Provider/modules/Code';
import RecoveryCode from '@/components/modules/RecoveryCode';
import setupI18n from '@/locales/i18nSetup';
import { CHALLENGE_TYPES } from '@/constants';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('ProviderContainer', () => {
  let wrapper;

  const wrapperFactory = (options, props) => {
    return shallowMount(ProviderContainer, {
      localVue,
      i18n,
      propsData: {
        email,
        loginChallenge: '123',
        error: '',
        isLoading: false,
        challengeType: CHALLENGE_TYPES.EMAIL_OTP,
        ...props,
      },
      sync: false,
      ...options,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = wrapperFactory();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('ProviderContainer');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render code', () => {
      wrapper = wrapperFactory();

      expect(wrapper.find('code-stub').exists()).toBe(true);
    });

    it('should render error', () => {
      wrapper = wrapperFactory(null, {
        error: 'error',
      });

      expect(wrapper.find('error-stub').exists()).toBe(true);
    });

    it('should render no challenge', () => {
      wrapper = wrapperFactory(null, {
        loginChallenge: '',
      });

      expect(wrapper.find('nochallenge-stub').exists()).toBe(true);
    });

    it('should render recovery code', async () => {
      expect.assertions(1);

      wrapper = wrapperFactory();

      wrapper.find(Code).vm.$emit('recover');

      await wrapper.vm.$nextTick();

      expect(wrapper.find('recoverycode-stub').exists()).toBe(true);
    });

    it('should return from recovery code', async () => {
      expect.assertions(2);

      wrapper = wrapperFactory();
      wrapper.find(Code).vm.$emit('recover');
      await wrapper.vm.$nextTick();

      expect(wrapper.find(RecoveryCode).exists()).toBe(true);

      wrapper.find(RecoveryCode).vm.$emit('recovered');
      await wrapper.vm.$nextTick();

      expect(wrapper.find(Code).exists()).toBe(true);
    });
  });

  describe('behavior', () => {
    it('should emit complete event', () => {
      expect(wrapper.emitted().complete).toBeUndefined();
      const redirect = 'redirect';

      wrapper.find('code-stub').vm.$emit('complete', { redirect });

      expect(wrapper.emitted().complete.length).toBe(1);
      expect(wrapper.emitted().complete[0]).toEqual([{ redirect }]);
    });
  });
});
