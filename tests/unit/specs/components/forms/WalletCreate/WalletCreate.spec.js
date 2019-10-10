import { shallowMount, createLocalVue } from '@vue/test-utils';
import WalletCreate from '@/components/forms/WalletCreate';

const localVue = createLocalVue();

describe('WalletCreate', () => {
  let wrapper;
  const createHandler = jest.fn();
  const seedKey = 'seedKey';

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(WalletCreate, {
      localVue,
      propsData: {
        createHandler,
      },
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
    it('should switch to seed form', () => {
      wrapper.find('wallet-password-stub').vm.$emit('create', { seedKey });

      expect(wrapper.find('wallet-password-stub').exists()).toBe(false);
      expect(wrapper.find('wallet-seed-stub').exists()).toBe(true);
      expect(wrapper.emitted().submit).toBe(undefined);
    });

    it('should emit submit after all pass', () => {
      wrapper.find('wallet-password-stub').vm.$emit('create', { seedKey });
      wrapper.find('wallet-seed-stub').vm.$emit('submit');

      expect(wrapper.find('wallet-seed-stub').exists()).toBe(true);
      expect(wrapper.emitted().submit).toEqual([[{ seedKey }]]);
    });
  });
});
