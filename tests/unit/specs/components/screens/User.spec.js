import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import User from '@/components/screens/User';
import setupI18n from '@/locales/i18nSetup';
import { accountChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import createStore from '@/store/createStore';
import createStores from '@/store/createStores';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('User', () => {
  let wrapper;
  let accountsStore;

  beforeEach(async () => {
    bridgeMessenger.sendAndWaitResponse.mockResolvedValueOnce({});

    const store = createStore();
    const {
      accountsStore: accountStoreModule,
      coreStore,
      sharedStore,
    } = createStores(store);
    accountsStore = accountStoreModule;

    await accountsStore.defineSettings();
    await accountsStore.defineOnlyV3Accounts();

    wrapper = shallowMount(User, {
      accountsStore,
      coreStore,
      sharedStore,
      localVue,
      i18n,
    });
  });

  describe('render', () => {
    it('should correctly render User component', () => {
      expect(wrapper.name()).toBe('User');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should set form data from settings on create', () => {
      expect(wrapper.vm.formData).toEqual({
        activeAccount: '0x0',
        activeNet: 1,
      });
    });

    it('should update settings of form submit', async () => {
      expect.assertions(1);

      const dataPromise = accountChannel.take();
      const { activeAccount, activeNet } = wrapper.vm.formData;

      wrapper.find('account-form-stub').vm.$emit('submit');

      await global.flushPromises();
      const res = await dataPromise;

      expect(res).toEqual(
        Answer.createOk({
          settings: {
            activeAccount,
            activeNet,
          },
          type: 'update',
        }),
      );
    });

    it('should logout if logout button was pressed in form', async () => {
      expect.assertions(2);

      expect(accountsStore.isLogin).toBe(true);

      wrapper.find('account-form-stub').vm.$emit('logout');

      await global.flushPromises();

      expect(accountsStore.isLogin).toBe(false);
    });

    it('should close account if cancel button was pressed in form', async () => {
      expect.assertions(1);

      const dataPromise = accountChannel.take();

      wrapper.find('account-form-stub').vm.$emit('cancel');
      const res = await dataPromise;
      expect(res).toEqual(Answer.createOk({ type: 'close' }));
    });
  });
});
