import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import SignPermission from '@/components/screens/SignPermission.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('SignPermission', () => {
  describe('render', () => {
    let store;
    let storeData;
    let wrapper;
    let accountsModule;
    let requestsModule;
    let coreModule;

    beforeEach(() => {
      coreModule = {
        state: {
          inited: true,
          loading: false,
        },
        actions: {
          sendReadyMessage: jest.fn(),
          dialogClose: jest.fn(),
        },
        getters: {
          isDialog: jest.fn(() => true),
        },
      };
      accountsModule = {
        actions: {
          cancelSignPermission: jest.fn(),
          signPermission: jest.fn(),
          openCreateAccountPage: jest.fn(),
          checkAccountExists: jest.fn(),
          awaitAccountCreate: jest.fn(),
          logout: jest.fn(),
        },
      };
      requestsModule = {
        actions: {
          cancelRequest: jest.fn(),
        },
      };
      storeData = {
        modules: {
          accounts: accountsModule,
          core: coreModule,
          requests: requestsModule,
        },
      };
      store = new Vuex.Store(storeData);
      wrapper = shallowMount(SignPermission, {
        localVue,
        store,
      });
    });

    describe('render', () => {
      it('should correctly render SignPermission component', () => {
        expect(wrapper.name()).toBe('SignPermission');
        expect(wrapper.html()).toMatchSnapshot();
      });
    });

    describe('behavior', () => {
      it('should send sign request', async () => {
        expect.assertions(1);

        wrapper.vm.handleSignSubmit('foo');

        await global.flushPromises();

        expect(accountsModule.actions.signPermission).toBeCalledWith(
          expect.any(Object),
          {
            password: 'foo',
          },
          undefined,
        );
      });
    });
  });
});
