import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ConnectError from '@endpass/class/ConnectError';
import Auth from '@/components/screens/Auth';
import setupI18n from '@/locales/i18nSetup';
import identityService from '@/service/identity';
import { authChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import createStore from '@/store/createStore';
import createStores from '@/store/createStores';

const localVue = createLocalVue();

const { ERRORS } = ConnectError;

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('Auth', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    const store = createStore();
    const { accountsStore, coreStore } = createStores(store);

    wrapper = shallowMount(Auth, {
      accountsStore,
      coreStore,
      localVue,
      i18n,
    });
  });

  describe('render', () => {
    it('should correctly render Auth screen component', () => {
      expect(wrapper.find('composite-auth-form-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render create account form if user authorized but does not have any account', async () => {
      expect.assertions(3);

      identityService.checkAccountExist.mockResolvedValueOnce(false);

      expect(wrapper.find('create-wallet-form-stub').exists()).toBe(false);

      wrapper.find('composite-auth-form-stub').vm.$emit('authorize');

      await global.flushPromises();

      expect(wrapper.find('create-wallet-form-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render auth form if user authorized and have any account', async () => {
      expect.assertions(2);

      identityService.checkAccountExist.mockResolvedValueOnce(true);
      wrapper.find('composite-auth-form-stub').vm.$emit('authorize');

      await global.flushPromises();

      expect(wrapper.find('composite-auth-form-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should confirm auth on auth form authorize event handling', async () => {
      expect.assertions(1);

      identityService.checkAccountExist.mockResolvedValueOnce(true);
      const dataPromise = authChannel.take();
      const payload = {
        serverMode: {
          foo: 'bar',
        },
      };

      wrapper.find('composite-auth-form-stub').vm.$emit('authorize', payload);

      await global.flushPromises();
      const res = await dataPromise;

      expect(res).toEqual(Answer.createOk(payload.serverMode));
    });

    describe('create account form logic', () => {
      it('should logout when create account skip', async () => {
        expect.assertions(3);

        const dataPromise = authChannel.take();
        accountsStore.setAuthByCode(200);
        bridgeMessenger.sendAndWaitResponse.mockResolvedValueOnce({});
        identityService.checkAccountExist.mockResolvedValueOnce(false);

        expect(accountsStore.isLogin).toBe(true);

        wrapper.find('composite-auth-form-stub').vm.$emit('authorize');

        await global.flushPromises();

        wrapper.find('v-modal-card-stub').vm.$emit('close');

        await global.flushPromises();
        const res = await dataPromise;

        expect(res).toEqual(
          Answer.createFail(
            ERRORS.AUTH_CANCELED_BY_USER,
            'Authentication was canceled by user!',
          ),
        );
        expect(accountsStore.isLogin).toBe(false);
      });
    });
  });
});
