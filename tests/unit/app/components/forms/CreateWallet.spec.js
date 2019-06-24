import Vuex from 'vuex';
import VueTimers from 'vue-timers/mixin';
import validation from '@/validation';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import CreateWallet from '@/components/forms/CreateWallet.vue';
import setupI18n from '@/locales/i18nSetup';
import VeeValidate from 'vee-validate';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VeeValidate);
localVue.use(validation);
const i18n = setupI18n(localVue);

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
      i18n,
      mixins: [VueTimers],
      provide: {
        theme: 'default',
      },
    });
  });

  describe('render', () => {
    it('should correctly render CreateWallet component', () => {
      expect(wrapper.name()).toBe('CreateWalletForm');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  async function doSubmit() {
    await wrapper.vm.$nextTick();
    wrapper.find('[data-test=define-pwd-form]').trigger('submit');
  }

  describe('behavior', () => {
    it('should not switch from password form', async () => {
      expect.assertions(2);

      await doSubmit();
      await global.flushPromises();

      expect(wrapper.find('[data-test=seed-phrase]').exists()).toBe(false);

      wrapper.setData({
        passwordConfirm: 'pwd',
        password: 'pw',
      });

      await doSubmit();
      await global.flushPromises();

      expect(wrapper.find('[data-test=seed-phrase]').exists()).toBe(false);
    });

    it('should not switch to seed box, if pwd less 8', async () => {
      expect.assertions(2);

      expect(wrapper.find('[data-test=seed-phrase]').exists()).toBe(false);

      wrapper.setData({
        passwordConfirm: 'pwd',
        password: 'pwd',
      });
      accountsModule.actions.createWallet.mockRejectedValueOnce('kek');

      await doSubmit();
      await global.flushPromises();

      expect(wrapper.find('[data-test=seed-phrase]').exists()).toBe(false);
    });

    it('should validate pwd value and switch to seed box', async () => {
      expect.assertions(2);

      expect(wrapper.find('[data-test=create-wallet-error]').exists()).toBe(
        false,
      );

      wrapper.setData({
        passwordConfirm: '12345678',
        password: '12345678',
      });
      accountsModule.actions.createWallet.mockResolvedValueOnce('kek');

      await doSubmit();
      await global.flushPromises();

      expect(wrapper.find('[data-test=seed-phrase]').exists()).toBe(true);
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

      await doSubmit();
      await global.flushPromises();

      expect(wrapper.find('[data-test=create-wallet-error]').exists()).toBe(
        false,
      );
    });
  });
});
