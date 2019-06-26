import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import SignPasswordForm from '@/components/forms/SignPassword';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('SignPasswordForm', () => {
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
      getters: {
        isDialog: jest.fn(() => true),
      },
    };
    accountsModule = {
      actions: {
        openCreateAccountPage: jest.fn(),
        checkAccountExists: jest.fn(),
        waitAccountCreate: jest.fn(),
        logout: jest.fn(),
      },
    };
    storeData = {
      modules: {
        accounts: accountsModule,
        core: coreModule,
      },
    };
    store = new Vuex.Store(storeData);
    wrapper = shallowMount(SignPasswordForm, {
      localVue,
      store,
      provide: {
        theme: 'default',
      },
    });
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('SignPasswordForm');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should open accounts create tab', () => {
      wrapper.vm.handleAccountRequest();

      expect(accountsModule.actions.openCreateAccountPage).toBeCalled();
    });

    it('should show create account form', async () => {
      expect.assertions(2);

      accountsModule.actions.checkAccountExists.mockResolvedValueOnce(false);

      wrapper = shallowMount(SignPasswordForm, {
        localVue,
        store,
        provide: {
          theme: 'default',
        },
      });

      await global.flushPromises();

      expect(accountsModule.actions.waitAccountCreate).toBeCalled();
      expect(wrapper.find('password-form-stub').exists()).toBe(true);
    });

    it('should do logout', () => {
      wrapper.vm.handleLogout();

      expect(accountsModule.actions.logout).toBeCalled();
      expect(wrapper.emitted().cancel).toBeTruthy();
    });
  });
});
