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
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should confirm auth on auth form authorize event handling', () => {
      const payload = {
        serverMode: {
          foo: 'bar',
        },
      };

      wrapper.find('composite-auth-form-stub').vm.$emit('authorize', payload);

      expect(accountsModule.actions.confirmAuth).toBeCalledWith(
        expect.any(Object),
        payload.serverMode,
        undefined,
      );
    });
  });
});
