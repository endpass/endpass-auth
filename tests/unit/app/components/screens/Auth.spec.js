import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Auth from '@/components/screens/Auth.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('Auth', () => {
  let store;
  let storeData;
  let wrapper;
  let coreModule;
  let accountsModule;

  beforeEach(() => {
    jest.clearAllMocks();

    coreModule = {
      state: {
        showCreateAccount: true,
      },
      getters: {
        isDialog: jest.fn(() => true),
      },
      actions: {
        dialogClose: jest.fn(),
      },
    };
    accountsModule = {
      actions: {
        cancelAuth: jest.fn(),
        confirmAuth: jest.fn(),
        checkAccountExists: jest.fn().mockResolvedValue(true),
        openCreateAccountPage: jest.fn(),
        waitAccountCreate: jest.fn(),
      },
    };
    storeData = {
      modules: {
        core: coreModule,
        accounts: accountsModule,
      },
    };
    store = new Vuex.Store(storeData);
    wrapper = shallowMount(Auth, {
      localVue,
      store,
    });
  });

  describe('render', () => {
    it('should correctly render Auth screen component', () => {
      expect(wrapper.find('composite-auth-form-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render create account form if user authorized but does not have any account', async () => {
      expect.assertions(3);

      accountsModule.actions.checkAccountExists.mockResolvedValue(false);

      wrapper.find('composite-auth-form-stub').vm.$emit('authorize');

      await global.flushPromises();

      expect(wrapper.find('create-account-form-stub').exists()).toBe(true);
      expect(accountsModule.actions.waitAccountCreate).toBeCalled();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render auth form if user authorized and have any account', async () => {
      expect.assertions(2);

      wrapper.find('composite-auth-form-stub').vm.$emit('authorize');

      await global.flushPromises();

      expect(wrapper.find('composite-auth-form-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should confirm auth on auth form authorize event handling', async () => {
      expect.assertions(1);

      const payload = {
        serverMode: {
          foo: 'bar',
        },
      };

      wrapper.find('composite-auth-form-stub').vm.$emit('authorize', payload);

      await global.flushPromises();

      expect(accountsModule.actions.confirmAuth).toBeCalledWith(
        expect.any(Object),
        payload.serverMode,
        undefined,
      );
    });

    describe('create account form logic', () => {
      it('should open create account page on request event handling', () => {
        wrapper.setData({
          activeForm: 'CREATE_ACCOUNT',
        });

        wrapper.find('create-account-form-stub').vm.$emit('request');

        expect(accountsModule.actions.openCreateAccountPage).toBeCalled();
      });
    });
  });
});
