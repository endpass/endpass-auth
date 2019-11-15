import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ConnectError from '@endpass/connect/ConnectError';
import WalletCreate from '@/components/screens/WalletCreate';
import setupI18n from '@/locales/i18nSetup';
import { walletChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { METHODS } from '@/constants';

const localVue = createLocalVue();

const { ERRORS } = ConnectError;

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('WalletCreate', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    const store = createStore();
    const { coreStore } = createStoreModules(store);

    wrapper = shallowMount(WalletCreate, {
      coreStore,
      localVue,
      i18n,
    });
  });

  describe('render', () => {
    it('should correctly render WalletCreate screen component', () => {
      expect(wrapper.find('wallet-create-form-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should confirm create wallet', async () => {
      expect.assertions(1);

      const payload = { data: 'data' };
      const dataPromise = walletChannel.take();

      wrapper.find('wallet-create-form-stub').vm.$emit('submit', payload);

      await global.flushPromises();
      const res = await dataPromise;

      expect(res).toEqual(Answer.createOk(payload));
    });

    it('should cancel create wallet', async () => {
      expect.assertions(2);

      const dataPromise = walletChannel.take();

      wrapper.find('v-modal-card-stub').vm.$emit('close');

      await global.flushPromises();
      const res = await dataPromise;

      expect(res).toEqual(
        Answer.createFail(
          ERRORS.CREATE_WALLET,
          i18n.t('store.error.wallet.walletCreate'),
        ),
      );
      expect(bridgeMessenger.send).toBeCalledWith(METHODS.DIALOG_CLOSE);
    });
  });
});
