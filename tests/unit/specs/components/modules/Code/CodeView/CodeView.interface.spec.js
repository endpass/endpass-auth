import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, code } from '@unitFixtures/auth';
import CodeViewInterface from '@/components/modules/CodeRequest/modules/CodeView/CodeView.interface';
import CodeViewContainer from '@/components/modules/CodeRequest/modules/CodeView/CodeView.container';
import setupI18n from '@/locales/i18nSetup';
import { CHALLENGE_TYPES } from '@/constants';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('CodeViewInterface', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(CodeViewInterface, {
      localVue,
      i18n,
      propsData: {
        isLoading: false,
        error: '',
        challengeType: CHALLENGE_TYPES.EMAIL_OTP,
        email,
      },
    });
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('CodeViewInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render code form', () => {
      expect(wrapper.find('code-view-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit recover event', () => {
      expect(wrapper.emitted().recover).toBeUndefined();

      wrapper.find(CodeViewContainer).vm.$emit('recover');

      expect(wrapper.emitted().recover).toHaveLength(1);
      expect(wrapper.emitted().recover[0]).toEqual([]);
    });

    it('should emit submit event', () => {
      expect(wrapper.emitted().submit).toBeUndefined();

      wrapper.find(CodeViewContainer).vm.$emit('submit', { code });

      expect(wrapper.emitted().submit.length).toBe(1);
      expect(wrapper.emitted().submit[0]).toEqual([{ code }]);
    });

    it('should emit send-code event', () => {
      expect(wrapper.emitted()['send-code']).toBeUndefined();

      wrapper.find(CodeViewContainer).vm.$emit('send-code');

      expect(wrapper.emitted()['send-code'].length).toBe(1);
      expect(wrapper.emitted()['send-code'][0]).toEqual([]);
    });
  });
});
