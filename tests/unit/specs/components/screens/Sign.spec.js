import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Sign from '@/components/screens/Sign';
import setupI18n from '@/locales/i18nSetup';
import { requestStore } from '@/store';
import { signChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('Sign', () => {
  describe('render', () => {
    let store;
    let wrapper;
    const request = {
      address: '0x0',
      request: {
        id: 1,
        params: ['foo', 'bar'],
        jsonrpc: '2.0',
      },
    };

    beforeEach(() => {
      wrapper = shallowMount(Sign, {
        localVue,
        i18n,
      });
    });

    describe('render', () => {
      it('should correctly render Sign component', () => {
        requestStore.setRequest(request);
        expect(wrapper.name()).toBe('Sign');
        expect(wrapper.html()).toMatchSnapshot();
      });
    });

    it('should render sign message form if request does not contains transaction', () => {
      requestStore.setRequest({
        request: {
          method: 'eth_sign',
        },
      });
      wrapper = shallowMount(Sign, {
        localVue,
        store,
        i18n,
      });

      expect(wrapper.find('sign-message-form-stub').exists()).toBe(true);
      expect(wrapper.find('sign-transaction-form-stub').exists()).toBe(false);
    });

    it('should render sign transaction form if request contains transaction', () => {
      requestStore.setRequest({
        request: {
          method: 'eth_sendTransaction',
        },
      });
      wrapper = shallowMount(Sign, {
        localVue,
        store,
        i18n,
      });

      expect(wrapper.find('sign-transaction-form-stub').exists()).toBe(true);
      expect(wrapper.find('sign-message-form-stub').exists()).toBe(false);
    });

    describe('behavior', () => {
      it('should confirm current request with password', async () => {
        expect.assertions(1);

        requestStore.setRequest(request);
        const dataPromise = signChannel.take();
        wrapper.find('sign-message-form-stub').vm.$emit('submit', {
          password: 'foo',
        });

        await global.flushPromises();
        const res = await dataPromise;

        expect(res).toEqual(
          Answer.createOk({
            id: 1,
            jsonrpc: '2.0',
            result: 'signature',
          }),
        );
      });

      it('should cancel current request', async () => {
        expect.assertions(1);

        requestStore.setRequest(request);
        const dataPromise = signChannel.take();

        wrapper.find('sign-message-form-stub').vm.$emit('cancel', {
          password: 'foo',
        });

        await global.flushPromises();
        const res = await dataPromise;

        expect(res).toEqual(
          Answer.createOk({
            id: 1,
            error: 'canceled',
            result: [],
          }),
        );
      });
    });
  });
});
