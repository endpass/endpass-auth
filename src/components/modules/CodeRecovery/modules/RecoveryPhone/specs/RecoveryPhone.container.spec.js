import { shallowMount, createLocalVue } from '@vue/test-utils';
import { code } from '@unitFixtures/auth';
import RecoveryPhoneContainer from '@/components/modules/CodeRecovery/modules/RecoveryPhone/RecoveryPhone.container';
import NoPhone from '@/components/modules/CodeRecovery/modules/RecoveryPhone/modules/NoPhone';
import WithPhone from '@/components/modules/CodeRecovery/modules/RecoveryPhone/modules/WithPhone';
import setupI18n from '@/locales/i18nSetup';
import LoadingScreen from '@/components/common/LoadingScreen';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('RecoveryPhoneContainer', () => {
  let wrapper;

  const wrapperFactory = (options, props) => {
    return shallowMount(RecoveryPhoneContainer, {
      localVue,
      i18n,
      propsData: {
        error: '',
        isLoading: false,
        isPhoneExist: true,
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
      expect(wrapper.name()).toBe('RecoveryPhoneContainer');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render loading', () => {
      wrapper = wrapperFactory(null, {
        isLoading: true,
      });

      expect(wrapper.find(LoadingScreen).attributes().isloading).toBeTruthy();
    });

    it('should render no phone', () => {
      wrapper = wrapperFactory(null, {
        isPhoneExist: false,
      });

      expect(wrapper.find(NoPhone).exists()).toBe(true);
    });

    it('should render with phone', () => {
      wrapper = wrapperFactory(null, {
        isPhoneExist: true,
      });

      expect(wrapper.find(WithPhone).exists()).toBe(true);
    });
  });

  describe('behavior', () => {
    it('should emit complete event', () => {
      expect(wrapper.emitted().submit).toBeUndefined();

      wrapper.find(WithPhone).vm.$emit('submit', { code });

      expect(wrapper.emitted().submit.length).toBe(1);
      expect(wrapper.emitted().submit[0]).toEqual([{ code }]);
    });

    it('should emit send-code event', () => {
      expect(wrapper.emitted()['send-code']).toBeUndefined();

      wrapper.find(WithPhone).vm.$emit('send-code');

      expect(wrapper.emitted()['send-code'].length).toBe(1);
      expect(wrapper.emitted()['send-code'][0]).toEqual([]);
    });

    it('should emit recovery cancel event', () => {
      expect(wrapper.emitted().cancel).toBeUndefined();

      wrapper.find(WithPhone).vm.$emit('cancel');

      expect(wrapper.emitted()['recovery-cancel'].length).toBe(1);
      expect(wrapper.emitted()['recovery-cancel'][0]).toEqual([]);
    });
  });
});
