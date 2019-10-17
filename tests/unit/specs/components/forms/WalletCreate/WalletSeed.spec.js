import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import WalletSeed from '@/components/forms/WalletCreate/WalletSeed';
import setupI18n from '@/locales/i18nSetup';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

jest.useFakeTimers();

describe('WalletSeed', () => {
  let wrapper;
  let accountsStore;
  const seedKey = 'foo baz bar';

  beforeEach(() => {
    jest.clearAllMocks();
    const store = createStore();
    const { accountsStore: accountsStoreModule } = createStoreModules(store);
    accountsStore = accountsStoreModule;
    wrapper = shallowMount(WalletSeed, {
      accountsStore,
      localVue,
      i18n,
      propsData: {
        seedKey,
      },
      provide: {
        theme: 'default',
      },
    });
  });

  describe('render', () => {
    it('should correctly render WalletSeed component', () => {
      expect(wrapper.name()).toBe('WalletSeed');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should not submit if seed phrase is not checked', () => {
      wrapper.find('[data-test=continue-button]').vm.$emit('click');

      expect(wrapper.emitted().submit).toBe(undefined);
    });

    it('should submit if seed phrase is checked', () => {
      wrapper.find('[data-test=wallet-seed-confirm]').vm.$emit('input', true);
      wrapper.find('[data-test=continue-button]').vm.$emit('click');

      expect(wrapper.emitted().submit).toEqual([[]]);
    });
  });
});
