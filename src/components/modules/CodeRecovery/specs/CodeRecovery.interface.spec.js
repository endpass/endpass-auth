import { shallowMount, createLocalVue } from '@vue/test-utils';
import CodeRecoveryInteractor from '@/components/modules/CodeRecovery/CodeRecovery.interactor';
import CodeRecoveryInterface from '@/components/modules/CodeRecovery/CodeRecovery.interface';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('CodeRecoveryInterface', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(CodeRecoveryInterface, {
      localVue,
      i18n,
      propsData: {
        email: '',
      },
    });
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('CodeRecoveryInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render recovery code', () => {
      expect(wrapper.find(CodeRecoveryInteractor).exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit complete event', () => {
      expect(wrapper.emitted().complete).toBeUndefined();

      wrapper.find(CodeRecoveryInteractor).vm.$emit('recovered');

      expect(wrapper.emitted().recovered.length).toBe(1);
      expect(wrapper.emitted().recovered[0]).toEqual([]);
    });

    it('should emit cancel event', () => {
      expect(wrapper.emitted().switch).toBeUndefined();

      wrapper.find(CodeRecoveryInteractor).vm.$emit('recovery-cancel');

      expect(wrapper.emitted()['recovery-cancel'].length).toBe(1);
      expect(wrapper.emitted()['recovery-cancel'][0]).toEqual([]);
    });
  });
});
