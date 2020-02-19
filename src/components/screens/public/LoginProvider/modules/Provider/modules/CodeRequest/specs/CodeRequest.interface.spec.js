import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email } from '@unitFixtures/auth';
import CodeRequestInterface from '@/components/screens/public/LoginProvider/modules/Provider/modules/CodeRequest/CodeRequest.interface';
import CodeRequestInteractor from '@/components/screens/public/LoginProvider/modules/Provider/modules/CodeRequest/CodeRequest.interactor';
import setupI18n from '@/locales/i18nSetup';
import { CHALLENGE_TYPES } from '@/constants';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('CodeRequestInterface', () => {
  let wrapper;
  const redirect = 'redirect';

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(CodeRequestInterface, {
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
      expect(wrapper.name()).toBe('CodeRequestInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render code form', () => {
      expect(wrapper.find(CodeRequestInteractor).exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit complete event', () => {
      expect(wrapper.emitted().complete).toBeUndefined();

      wrapper.find(CodeRequestInteractor).vm.$emit('complete', { redirect });

      expect(wrapper.emitted().complete.length).toBe(1);
      expect(wrapper.emitted().complete[0]).toEqual([{ redirect }]);
    });

    it('should emit switch event', () => {
      expect(wrapper.emitted().recover).toBeUndefined();

      wrapper.find(CodeRequestInteractor).vm.$emit('recover');

      expect(wrapper.emitted().recover).toHaveLength(1);
      expect(wrapper.emitted().recover[0]).toEqual([]);
    });
  });
});
