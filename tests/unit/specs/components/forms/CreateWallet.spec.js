import Vuex from 'vuex';
import VueTimers from 'vue-timers/mixin';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import { hdv3, v3KeyStore } from '@unitFixtures/accounts';
import walletGen from '@endpass/utils/walletGen';
import validation from '@/validation';
import CreateWallet from '@/components/forms/CreateWallet';
import setupI18n from '@/locales/i18nSetup';
import userService from '@/service/user';
import createStore from '@/store/createStore';
import createStores from '@/store/createStores';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VeeValidate);
localVue.use(validation);
const i18n = setupI18n(localVue);

jest.useFakeTimers();

describe('CreateWallet', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();
    const wallet = {
      seedKey: 'seedKey',
      encryptedSeed: 'encryptedSeed',
      v3KeystoreHdWallet: hdv3,
      v3KeystoreChildWallet: v3KeyStore,
    };

    walletGen.createComplex.mockResolvedValueOnce(wallet);

    const store = createStore();
    const { accountsStore } = createStores(store);

    wrapper = shallowMount(CreateWallet, {
      accountsStore,
      localVue,
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

      await doSubmit();
      await global.flushPromises();

      expect(wrapper.find('[data-test=seed-phrase]').exists()).toBe(true);
    });

    it('should handle error, if create wallet broken', async () => {
      expect.assertions(2);

      userService.setAccount.mockRejectedValueOnce('');
      expect(wrapper.find('[data-test=create-wallet-error]').exists()).toBe(
        false,
      );

      wrapper.setData({
        passwordConfirm: 'pwd123123123',
        password: 'pwd123123123',
      });

      await doSubmit();
      await global.flushPromises();

      expect(wrapper.find('[data-test=create-wallet-error]').exists()).toBe(
        true,
      );
    });

    it('should not submit if seed phrase is not checked', async () => {
      expect.assertions(2);

      expect(accountsStore.isAccountCreated).toBe(false);

      wrapper.setData({
        isShowSeed: true,
        seedKey: 'foo bar baz',
      });

      wrapper.find('[data-test=continue-button]').vm.$emit('click');

      await global.flushPromises();

      expect(accountsStore.isAccountCreated).toBe(false);
    });

    it('should submit if seed phrase is checked', async () => {
      expect.assertions(2);

      expect(accountsStore.isAccountCreated).toBe(false);

      wrapper.setData({
        isShowSeed: true,
        isSeedConfirmed: true,
        seedKey: 'foo bar baz',
      });

      wrapper.find('[data-test=continue-button]').vm.$emit('click');

      await global.flushPromises();

      expect(accountsStore.isAccountCreated).toBe(true);
    });
  });
});
