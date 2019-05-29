import Vuex from 'vuex';
import VueTimers from 'vue-timers/mixin';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import CreateWallet from '@/components/forms/CreateWallet.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

jest.useFakeTimers();

describe('CreateWallet', () => {
  let wrapper;
  let store;
  let storeData;
  let accountsModule;

  beforeEach(() => {
    jest.clearAllMocks();
    accountsModule = {
      state: {
        isAccountCreated: false,
      },
      actions: {
        createWallet: jest.fn(),
        setWalletCreated: jest.fn(),
      },
    };
    storeData = {
      modules: {
        accounts: accountsModule,
      },
    };

    store = new Vuex.Store(storeData);
    wrapper = shallowMount(CreateWallet, {
      localVue,
      store,
      mixins: [VueTimers],
    });
  });

  describe('render', () => {
    it('should correctly render CreateWallet component', () => {
      expect(wrapper.name()).toBe('CreateWalletForm');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should not switch from password form', async () => {
      expect.assertions(2);

      wrapper.find('[data-test=define-pwd-form]').trigger('submit');
      await global.flushPromises();

      expect(wrapper.find('[data-test=seed-phrase]').exists()).toBe(false);

      wrapper.setData({
        passwordConfirm: 'pwd',
        password: 'pw',
      });

      wrapper.find('[data-test=define-pwd-form]').trigger('submit');
      await global.flushPromises();

      expect(wrapper.find('[data-test=seed-phrase]').exists()).toBe(false);
    });

    it('should switch to seed box', async () => {
      expect.assertions(3);

      expect(wrapper.find('[data-test=seed-phrase]').exists()).toBe(false);

      wrapper.setData({
        passwordConfirm: 'pwd',
        password: 'pwd',
      });

      wrapper.find('[data-test=define-pwd-form]').trigger('submit');
      await global.flushPromises();

      expect(wrapper.find('[data-test=seed-phrase]').exists()).toBe(false);

      wrapper.vm.$timer.start('seedPhrase');
      jest.runOnlyPendingTimers();

      expect(wrapper.find('[data-test=seed-phrase]').exists()).toBe(false);
    });

    it('should handle error, if create wallet broken', async () => {
      expect.assertions(2);

      expect(wrapper.find('[data-test=create-wallet-error]').exists()).toBe(
        false,
      );

      wrapper.setData({
        passwordConfirm: 'pwd',
        password: 'pwd',
      });
      accountsModule.actions.createWallet.mockRejectedValueOnce('kek');

      wrapper.find('[data-test=define-pwd-form]').trigger('submit');
      await global.flushPromises();

      expect(wrapper.find('[data-test=create-wallet-error]').exists()).toBe(
        true,
      );
    });
  });
});
