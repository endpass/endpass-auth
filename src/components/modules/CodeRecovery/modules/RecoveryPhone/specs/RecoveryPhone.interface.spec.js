import { shallowMount, createLocalVue } from '@vue/test-utils';
import RecoveryPhoneContainer from '@/components/modules/CodeRecovery/modules/RecoveryPhone/RecoveryPhone.container';
import RecoveryPhoneInterface from '@/components/modules/CodeRecovery/modules/RecoveryPhone/RecoveryPhone.interface';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('RecoveryPhoneInterface', () => {
  let wrapper;
  const code = '123';

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(RecoveryPhoneInterface, {
      localVue,
      i18n,
      propsData: {
        email: '',
      },
    });
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('RecoveryPhoneInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render recovery code', () => {
      expect(wrapper.find(RecoveryPhoneContainer).exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit submit event', () => {
      expect(wrapper.emitted().submit).toBeUndefined();

      wrapper.find(RecoveryPhoneContainer).vm.$emit('submit', { code });

      expect(wrapper.emitted().submit.length).toBe(1);
      expect(wrapper.emitted().submit[0]).toEqual([{ code }]);
    });

    it('should emit cancel event', () => {
      expect(wrapper.emitted()['recovery-cancel']).toBeUndefined();

      wrapper.find(RecoveryPhoneContainer).vm.$emit('cancel');

      expect(wrapper.emitted()['recovery-cancel'].length).toBe(1);
      expect(wrapper.emitted()['recovery-cancel'][0]).toEqual([]);
    });

    it('should emit send code event', () => {
      expect(wrapper.emitted()['send-code']).toBeUndefined();

      wrapper.find(RecoveryPhoneContainer).vm.$emit('send-code');

      expect(wrapper.emitted()['send-code'].length).toBe(1);
      expect(wrapper.emitted()['send-code'][0]).toEqual([]);
    });
  });
});
