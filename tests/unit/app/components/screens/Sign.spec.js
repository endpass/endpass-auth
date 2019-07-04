import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Sign from '@/components/screens/Sign.vue';
import setupI18n from '@/locales/i18nSetup';
import { requestWithTransaction } from '@unitFixtures/requests';

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
    let gasPriceModule;
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
      gasPriceModule = {
        actions: {
          getGasPrice: jest.fn(),
        },
      };
      storeData = {
        modules: {
          accounts: accountsModule,
          core: coreModule,
          requests: requestsModule,
          gasPrice: gasPriceModule,
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

      it('should not request gas prices if current request not contains transaction', async () => {
        expect.assertions(1);

        await global.flushPromises();

        expect(gasPriceModule.actions.getGasPrice).not.toBeCalled();
      });

      it('should request gas prices if current request contains transaction', async () => {
        expect.assertions(1);

        requestsModule.state.request = requestWithTransaction;

        wrapper = shallowMount(Sign, {
          localVue,
          store,
          i18n,
        });

        await global.flushPromises();

        expect(gasPriceModule.actions.getGasPrice).toBeCalled();
      });
    });
  });
});
