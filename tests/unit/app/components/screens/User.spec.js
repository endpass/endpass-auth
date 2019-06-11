import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import User from '@/components/screens/User.vue';
import { accounts } from '@unitFixtures/accounts';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('User', () => {
  let store;
  let storeData;
  let wrapper;
  let accountsModule;
  let coreModule;

  beforeEach(() => {
    coreModule = {
      state: {
        isInited: true,
        loading: false,
      },
      actions: {
        dialogClose: jest.fn(),
        logout: jest.fn(),
      },
      getters: {
        isDialog: jest.fn(() => true),
      },
    };
    accountsModule = {
      state: {
        linkSent: false,
        settings: {
          lastActiveAccount: '0x0',
          net: 1,
        },
        accounts,
      },
      actions: {
        closeAccount: jest.fn(),
        updateSettings: jest.fn(),
        getAccounts: jest.fn(),
      },
    };
    storeData = {
      modules: {
        accounts: accountsModule,
        core: coreModule,
      },
    };
    store = new Vuex.Store(storeData);
    wrapper = shallowMount(User, {
      localVue,
      store,
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

    it('should update settings of form submit', () => {
      const { activeAccount, activeNet } = wrapper.vm.formData;

      wrapper.find('account-form-stub').vm.$emit('submit');

      expect(accountsModule.actions.updateSettings).toBeCalledWith(
        expect.any(Object),
        {
          lastActiveAccount: activeAccount,
          net: activeNet,
        },
        undefined,
      );
    });

    it('should logout if logout button was pressed in form', () => {
      wrapper.find('account-form-stub').vm.$emit('logout');

      expect(coreModule.actions.logout).toBeCalled();
    });

    it('should close account if cancel button was pressed in form', () => {
      wrapper.find('account-form-stub').vm.$emit('cancel');

      expect(accountsModule.actions.closeAccount).toBeCalled();
    });
  });
});
