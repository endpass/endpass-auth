import { shallowMount, createLocalVue } from '@vue/test-utils';
import RecoveryCodeInterface from '@/components/screens/Authenticator/modules/RecoveryCode/RecoveryCode.interface';
import RecoveryCode from '@/components/modules/RecoveryCode';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('RecoveryCodeInterface', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(RecoveryCodeInterface, {
      localVue,
      i18n,
      propsData: {
        email: '',
      },
    });
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('RecoveryCodeInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render recovery code', () => {
      expect(wrapper.find('recovery-code-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit complete event', () => {
      expect(wrapper.emitted().complete).toBeUndefined();

      wrapper.find(RecoveryCode).vm.$emit('recovered');

      expect(wrapper.emitted().complete.length).toBe(1);
      expect(wrapper.emitted().complete[0]).toEqual([]);
    });

    it('should emit switch event', () => {
      expect(wrapper.emitted().switch).toBeUndefined();

      wrapper.find(RecoveryCode).vm.$emit('recovery-cancel');

      expect(wrapper.emitted().switch.length).toBe(1);
      expect(wrapper.emitted().switch[0]).toEqual([{ to: 'app-code' }]);
    });
  });
});
