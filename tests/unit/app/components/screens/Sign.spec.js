import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Sign from '@/components/screens/Sign.vue';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('Sign', () => {
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
          isInited: true,
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
        state: {
          accounts: [],
        },
      };
      requestsModule = {
        state: {
          request: {},
        },
        actions: {
          awaitRequestMessage: jest.fn(),
          processRequest: jest.fn(),
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
      wrapper = shallowMount(Sign, {
        localVue,
        store,
        i18n,
      });
    });

    describe('render', () => {
      it('should correctly render Sign component', () => {
        expect(wrapper.name()).toBe('Sign');
        expect(wrapper.html()).toMatchSnapshot();
      });
    });

    describe('behavior', () => {
      it('should confirm current request with password', () => {
        // TODO Have troubles with triggering event from stub, solve it when possivble
        wrapper.vm.handleSignSubmit({
          password: 'foo',
        });

        expect(requestsModule.actions.processRequest).toBeCalled();
      });

      it('should cancel current request', () => {
        // TODO Have troubles with triggering event from stub, solve it when possivble
        wrapper.vm.handleSignCancel();

        expect(requestsModule.actions.cancelRequest).toBeCalled();
      });
    });
  });
});
