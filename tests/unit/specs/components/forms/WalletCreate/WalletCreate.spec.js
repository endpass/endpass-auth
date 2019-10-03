import { shallowMount, createLocalVue } from '@vue/test-utils';
import WalletCreate from '@/components/forms/WalletCreate';

const localVue = createLocalVue();

describe('WalletCreate', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(WalletCreate, {
      localVue,
      provide: {
        theme: 'default',
      },
    });
  });

  describe('render', () => {
    it('should correctly render WalletCreate component', () => {
      expect(wrapper.name()).toBe('WalletCreateForm');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should switch from password form', () => {
      wrapper.find('walletpassword-stub').vm.$emit('create');

      expect(wrapper.find('walletpassword-stub').exists()).toBe(false);
      expect(wrapper.find('walletseed-stub').exists()).toBe(true);
      expect(wrapper.emitted().submit).toBe(undefined);
    });

    it('should not switch to seed box, if pwd less 8', () => {
      wrapper.find('walletpassword-stub').vm.$emit('create');
      wrapper.find('walletseed-stub').vm.$emit('submit');

      expect(wrapper.find('walletseed-stub').exists()).toBe(true);
      expect(wrapper.emitted().submit).toEqual([[]]);
    });
  });
});
