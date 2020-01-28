import Vuex from 'vuex';
import VueTimers from 'vue-timers/mixin';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import { hdv3, v3KeyStore } from '@unitFixtures/accounts';
import walletGen from '@endpass/utils/walletGen';
import validation from '@/validation';
import WalletPassword from '@/components/forms/WalletCreate/WalletPassword';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VeeValidate);
localVue.use(validation);
const i18n = setupI18n(localVue);

jest.useFakeTimers();

describe('WalletPassword', () => {
  let wrapper;
  const seedKey = 'seedKey';
  let createHandler = jest.fn();

  const doSubmit = async () => {
    await global.flushPromises();
    wrapper.find('[data-test=define-pwd-form]').trigger('submit');
    await global.flushPromises();
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const wallet = {
      seedKey,
      encryptedSeed: 'encryptedSeed',
      v3KeystoreHdWallet: hdv3,
      v3KeystoreChildWallet: v3KeyStore,
    };

    walletGen.createComplex.mockResolvedValueOnce(wallet);
    createHandler = jest.fn();

    wrapper = shallowMount(WalletPassword, {
      localVue,
      i18n,
      sync: false,
      mixins: [VueTimers],
      propsData: {
        createHandler,
      },
      provide: {
        theme: 'default',
      },
    });
  });

  describe('render', () => {
    it('should correctly render WalletPassword component', () => {
      expect(wrapper.name()).toBe('WalletPassword');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should not emit create event if no data', async () => {
      expect.assertions(1);

      await doSubmit();

      expect(wrapper.emitted().create).toBe(undefined);
    });

    it('should not switch if passwords does not match', async () => {
      expect.assertions(1);

      wrapper.find('[data-test=password-main]').vm.$emit('input', 'first');
      wrapper.find('[data-test=password-confirm]').vm.$emit('input', 'second');

      await doSubmit();

      expect(wrapper.emitted().create).toBe(undefined);
    });

    it('should not switch to seed box, if pwd less 8', async () => {
      expect.assertions(1);

      wrapper.find('[data-test=password-main]').vm.$emit('input', '123');
      wrapper.find('[data-test=password-confirm]').vm.$emit('input', '123');

      await doSubmit();

      expect(wrapper.emitted().create).toBe(undefined);
    });

    it('should validate pwd value and send seed', async () => {
      expect.assertions(2);

      const handlerData = { seedKey };

      createHandler.mockResolvedValueOnce(handlerData);

      expect(wrapper.find('[data-test=wallet-create-error]').exists()).toBe(
        false,
      );

      wrapper.find('[data-test=password-main]').vm.$emit('input', '12345678');
      wrapper
        .find('[data-test=password-confirm]')
        .vm.$emit('input', '12345678');

      await doSubmit();

      expect(wrapper.emitted().create).toEqual([[handlerData]]);
    });

    it('should handle error, if create wallet broken', async () => {
      expect.assertions(2);

      createHandler.mockRejectedValueOnce('');
      expect(wrapper.find('[data-test=wallet-create-error]').exists()).toBe(
        false,
      );

      wrapper.find('[data-test=password-main]').vm.$emit('input', '12345678');
      wrapper
        .find('[data-test=password-confirm]')
        .vm.$emit('input', '12345678');

      await doSubmit();

      expect(wrapper.find('[data-test=wallet-create-error]').exists()).toBe(
        true,
      );
    });
  });
});
