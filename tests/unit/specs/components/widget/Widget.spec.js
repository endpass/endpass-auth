import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { accountAddress, accounts } from '@unitFixtures/accounts';
import setupI18n from '@/locales/i18nSetup';

jest.mock('@/class/singleton/bridgeMessenger', () => ({
  subscribe: jest.fn(),
}));

/* eslint-disable */
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import Widget from '@/components/widget/Widget.vue';
/* eslint-enable */

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('Widget', () => {
  let wrapper;
  let storeData;
  let store;
  let coreModule;
  let widgetModule;
  let accountsModule;

  beforeEach(() => {
    accountsModule = {
      state: {
        settings: {
          lastActiveAccount: accountAddress,
          net: 1,
        },
        accounts,
      },
      actions: {
        defineSettings: jest.fn(),
        defineOnlyV3Accounts: jest.fn(),
        updateSettings: jest.fn(),
        subscribeOnBalanceUpdates: jest.fn(),
      },
    };
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
    coreModule = {
      state: {
        loading: false,
      },
      actions: {
        logout: jest.fn(),
      },
    };
    storeData = {
      modules: {
        core: coreModule,
        accounts: accountsModule,
        widget: widgetModule,
      },
    };
    store = new Vuex.Store(storeData);
    wrapper = shallowMount(Widget, {
      localVue,
      store,
      i18n,
    });
  });

  describe('render', () => {
    it('should correctly render', async () => {
      expect.assertions(1);

      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should request settings, accounts and subscribe on mount', async () => {
      expect.assertions(4);

      await global.flushPromises();

      expect(widgetModule.actions.initWidget).toBeCalled();
      expect(accountsModule.actions.defineSettings).toBeCalled();
      expect(accountsModule.actions.defineOnlyV3Accounts).toBeCalled();
      expect(accountsModule.actions.subscribeOnBalanceUpdates).toBeCalled();
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

    it('should correctly handle logout event', () => {
      wrapper.find('widget-accounts-stub').vm.$emit('logout');

      expect(coreModule.actions.logout).toBeCalled();
    });

    it('should render new account form on accounts newAccount action handle', async () => {
      wrapper.find('widget-accounts-stub').vm.$emit('new-account');

      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      expect(wrapper.find('widget-new-account-form-stub').exists()).toBe(true);
    });
  });
});
