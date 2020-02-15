import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email } from '@unitFixtures/auth';
import CodeInterface from '@/components/screens/public/LoginProvider/modules/Provider/modules/Code/Code.interface';
import CodeInteractor from '@/components/screens/public/LoginProvider/modules/Provider/modules/Code/Code.interactor';
import setupI18n from '@/locales/i18nSetup';
import { CHALLENGE_TYPES } from '@/constants';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('CodeInterface', () => {
  let wrapper;
  const redirect = 'redirect';

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(CodeInterface, {
      localVue,
      i18n,
      propsData: {
        email,
        challengeType: CHALLENGE_TYPES.EMAIL_OTP,
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

      wrapper.find(CodeInteractor).vm.$emit('complete', { redirect });

      expect(wrapper.emitted().complete.length).toBe(1);
      expect(wrapper.emitted().complete[0]).toEqual([{ redirect }]);
    });

    it('should emit switch event', () => {
      expect(wrapper.emitted().recover).toBeUndefined();

      wrapper.find(CodeInteractor).vm.$emit('recover');

      expect(wrapper.emitted().recover.length).toBe(1);
      expect(wrapper.emitted().recover[0]).toEqual([]);
    });
  });
});
