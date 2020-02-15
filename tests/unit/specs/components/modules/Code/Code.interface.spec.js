import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, code } from '@unitFixtures/auth';
import CodeInterface from '@/components/modules/Code/Code.interface';
import CodeInteractor from '@/components/modules/Code/Code.interactor';
import setupI18n from '@/locales/i18nSetup';
import { CHALLENGE_TYPES } from '@/constants';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('CodeInterface', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(CodeInterface, {
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
      expect(wrapper.name()).toBe('CodeInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render code form', () => {
      expect(wrapper.find(CodeInteractor).exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit recover event', () => {
      expect(wrapper.emitted().recover).toBeUndefined();

      wrapper.find(CodeInteractor).vm.$emit('recover');

      expect(wrapper.emitted().recover.length).toBe(1);
      expect(wrapper.emitted().recover[0]).toEqual([]);
    });

    it('should emit submit event', () => {
      expect(wrapper.emitted().submit).toBeUndefined();

      wrapper.find(CodeInteractor).vm.$emit('submit', { code });

      expect(wrapper.emitted().submit.length).toBe(1);
      expect(wrapper.emitted().submit[0]).toEqual([{ code }]);
    });

    it('should emit update event', () => {
      expect(wrapper.emitted()['update:is-loading']).toBeUndefined();
      expect(wrapper.emitted()['update:error']).toBeUndefined();

      wrapper.find(CodeInteractor).vm.$emit('update', { isLoading: true });

      expect(wrapper.emitted()['update:is-loading'].length).toBe(1);
      expect(wrapper.emitted()['update:error'].length).toBe(1);
      expect(wrapper.emitted()['update:is-loading'][0]).toEqual([true]);
      expect(wrapper.emitted()['update:error'][0]).toEqual(['']);
    });
  });
});
