import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Widget from '@/components/widget/Widget.vue';
import { accountAddress, accounts } from '@unitFixtures/accounts';

const localVue = createLocalVue();

localVue.use(Vuex);

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
        accounts,
      },
      actions: {
        defineOnlyV3Accounts: jest.fn(),
        getAccountBalance: jest.fn(),
      },
    };
    widgetModule = {
      state: {
        settings: {
          activeNet: 1,
          activeAccount: accountAddress,
        },
      },
      actions: {
        openWidget: jest.fn(),
        closeWidget: jest.fn(),
        openAccounts: jest.fn(),
        closeAccounts: jest.fn(),
        getWidgetSettings: jest.fn(),
        widgetLogout: jest.fn(),
        changeAccount: jest.fn(),
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
    });
  });

  describe('render', () => {
    it('should correctly render', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should request accounts and widget settings on mount', () => {
      expect(widgetModule.actions.getWidgetSettings).toBeCalled();
      expect(accountsModule.actions.defineOnlyV3Accounts).toBeCalled();
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
      wrapper.find('widget-content-stub').vm.$emit('accounts-toggle');

      expect(widgetModule.actions.openAccounts).toBeCalled();
      expect(wrapper.vm.isAccountsCollapsed).toBe(false);
    });

    it('should correctly close widget accounts', () => {
      wrapper.setData({
        isAccountsCollapsed: false,
      });
      wrapper.find('widget-content-stub').vm.$emit('accounts-toggle');

      expect(widgetModule.actions.closeAccounts).toBeCalled();
      expect(wrapper.vm.isAccountsCollapsed).toBe(true);
    });

    it('should correctly handle account change event', () => {
      wrapper
        .find('widget-content-stub')
        .vm.$emit('account-change', accounts[0].address);

      expect(widgetModule.actions.changeAccount).toBeCalledWith(
        expect.any(Object),
        accounts[0].address,
        undefined,
      );
    });

    it('should correctly handle logout event', () => {
      wrapper.find('widget-content-stub').vm.$emit('logout');

      expect(coreModule.actions.logout).toBeCalled();
    });

    it('should request balance on current account change', async () => {
      expect.assertions(3);

      widgetModule.state.settings.activeAccount = null;
      wrapper = shallowMount(Widget, {
        localVue,
        store,
      });

      expect(accountsModule.actions.getAccountBalance).not.toBeCalled();

      store.state.widget.settings.activeAccount = accounts[0].address;

      expect(accountsModule.actions.getAccountBalance).toBeCalled();

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.balance).not.toBe('0');
    });

    it('should set zero balance if balance request was failed', async () => {
      widgetModule.state.settings.activeAccount = null;
      wrapper = shallowMount(Widget, {
        localVue,
        store,
      });
      accountsModule.actions.getAccountBalance.mockRejectedValueOnce();
      store.state.widget.settings.activeAccount = accounts[0].address;

      expect(wrapper.vm.balance).toBe(null);
    });
  });
});
