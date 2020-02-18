import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, code } from '@unitFixtures/auth';
import CodeRequestInterface from '@/components/modules/CodeRequest/CodeRequest.interface';
import CodeRequestInteractor from '@/components/modules/CodeRequest/CodeRequest.interactor';
import setupI18n from '@/locales/i18nSetup';
import { CHALLENGE_TYPES } from '@/constants';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('CodeRequestInterface', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(CodeRequestInterface, {
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
      expect(wrapper.name()).toBe('CodeRequestInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render code form', () => {
      expect(wrapper.find(CodeRequestInteractor).exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit recover event', () => {
      expect(wrapper.emitted().recover).toBeUndefined();

      wrapper.find(CodeRequestInteractor).vm.$emit('recover');

      expect(wrapper.emitted().recover).toHaveLength(1);
      expect(wrapper.emitted().recover[0]).toEqual([]);
    });

    it('should emit submit event', () => {
      expect(wrapper.emitted().submit).toBeUndefined();

      wrapper.find(CodeRequestInteractor).vm.$emit('submit', { code });

      expect(wrapper.emitted().submit.length).toBe(1);
      expect(wrapper.emitted().submit[0]).toEqual([{ code }]);
    });

    it('should emit update event', () => {
      expect(wrapper.emitted()['update:is-loading']).toBeUndefined();
      expect(wrapper.emitted()['update:error']).toBeUndefined();

      wrapper
        .find(CodeRequestInteractor)
        .vm.$emit('update', { isLoading: true });

      expect(wrapper.emitted()['update:is-loading'].length).toBe(1);
      expect(wrapper.emitted()['update:error'].length).toBe(1);
      expect(wrapper.emitted()['update:is-loading']).toEqual([[true]]);
      expect(wrapper.emitted()['update:error']).toEqual([['']]);
    });
  });
});
