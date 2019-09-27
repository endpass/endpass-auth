import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { accountAddress, hdv3 } from '@unitFixtures/accounts';
import setupI18n from '@/locales/i18nSetup';
import Widget from '@/components/widget/Widget';
import userService from '@/service/user';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('Widget', () => {
  let wrapper;
  let storeData;
  let store;
  let widgetModule;
  let accountsStore;

  userService.getSettings.mockResolvedValue({
    lastActiveAccount: accountAddress,
    net: 1,
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  beforeEach(async () => {
    jest.useFakeTimers();

    widgetModule = {
      actions: {
        initWidget: jest.fn(),
        openWidget: jest.fn(),
        closeWidget: jest.fn(),
        openAccounts: jest.fn(),
        closeAccounts: jest.fn(),
        widgetLogout: jest.fn(),
      },
      getters: {
        isWidgetPinnedToTop: jest.fn(() => false),
        isWidgetPinnedToBottom: jest.fn(() => true),
      },
    };

    storeData = {
      modules: {
        widget: widgetModule,
      },
    };

    store = createStore(storeData);
    const {
      accountsStore: accountsStoreModule,
      coreStore,
    } = createStoreModules(store);
    accountsStore = accountsStoreModule;
    accountsStore.setAuthByCode(200);

    wrapper = shallowMount(Widget, {
      accountsStore,
      coreStore,
      localVue,
      store,
      i18n,
    });
  });

  describe('render', () => {
    it('should correctly render', async () => {
      expect.assertions(1);

      await global.flushPromises();

      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should request settings, accounts and subscribe on mount', async () => {
      expect.assertions(6);

      expect(accountsStore.accounts).toEqual([]);
      expect(accountsStore.balance).toBe(null);

      await global.flushPromises();
      jest.runOnlyPendingTimers();
      await global.flushPromises();

      expect(widgetModule.actions.initWidget).toBeCalled();
      expect(userService.getV3Accounts).toBeCalled();
      expect(accountsStore.accounts).toEqual([hdv3.info]);
      expect(accountsStore.balance).toBe('100000000000000');
    });

    it('should correctly open widget', () => {
      wrapper.find('widget-header-stub').vm.$emit('toggle');

      expect(widgetModule.actions.openWidget).toBeCalled();
      expect(wrapper.vm.isCollapsed).toBe(false);
    });

    it('should correctly close widget', () => {
      wrapper.setData({
        isCollapsed: false,
      });
      wrapper.find('widget-header-stub').vm.$emit('toggle');

      expect(widgetModule.actions.closeWidget).toBeCalled();
      expect(wrapper.vm.isCollapsed).toBe(true);
    });

    it('should correctly open widget accounts', () => {
      wrapper.find('widget-accounts-stub').vm.$emit('accounts-toggle');

      expect(widgetModule.actions.openAccounts).toBeCalled();
      expect(wrapper.vm.isAccountsCollapsed).toBe(false);
    });

    it('should correctly close widget accounts', () => {
      wrapper.setData({
        isAccountsCollapsed: false,
      });
      wrapper.find('widget-accounts-stub').vm.$emit('accounts-toggle');

      expect(widgetModule.actions.closeAccounts).toBeCalled();
      expect(wrapper.vm.isAccountsCollapsed).toBe(true);
    });

    it('should correctly handle logout event', async () => {
      expect.assertions(2);

      await global.flushPromises();

      expect(accountsStore.isLogin).toBe(true);

      bridgeMessenger.sendAndWaitResponse.mockResolvedValueOnce({});
      wrapper.find('widget-accounts-stub').vm.$emit('logout');

      await global.flushPromises();

      expect(accountsStore.isLogin).toBe(false);
    });

    it('should render new account form on accounts newAccount action handle', async () => {
      wrapper.find('widget-accounts-stub').vm.$emit('new-account');

      await global.flushPromises();

      expect(wrapper.find('widget-new-account-form-stub').exists()).toBe(true);
    });
  });
});
