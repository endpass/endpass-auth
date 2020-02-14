import { shallowMount, createLocalVue } from '@vue/test-utils';
import RecoveryViewContainer from '@/components/modules/RecoveryCode/modules/RecoveryView/RecoveryView.container';
import RecoveryViewInterface from '@/components/modules/RecoveryCode/modules/RecoveryView/RecoveryView.interface';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('RecoveryViewInterface', () => {
  let wrapper;
  const code = '123';

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(RecoveryViewInterface, {
      localVue,
      i18n,
      propsData: {
        email: '',
      },
    });
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('RecoveryViewInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render recovery code', () => {
      expect(wrapper.find('recovery-code-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit submit event', () => {
      expect(wrapper.emitted().submit).toBeUndefined();

      wrapper.find(RecoveryViewContainer).vm.$emit('submit', { code });

      expect(wrapper.emitted().submit.length).toBe(1);
      expect(wrapper.emitted().submit[0]).toEqual([{ code }]);
    });

    it('should emit cancel event', () => {
      expect(wrapper.emitted()['recovery-cancel']).toBeUndefined();

      wrapper.find(RecoveryViewContainer).vm.$emit('cancel');

      expect(wrapper.emitted()['recovery-cancel'].length).toBe(1);
      expect(wrapper.emitted()['recovery-cancel'][0]).toEqual([]);
    });

    it('should emit send code event', () => {
      expect(wrapper.emitted()['send-code']).toBeUndefined();

      wrapper.find(RecoveryViewContainer).vm.$emit('send-code');

      expect(wrapper.emitted()['send-code'].length).toBe(1);
      expect(wrapper.emitted()['send-code'][0]).toEqual([]);
    });
  });
});
