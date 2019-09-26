import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import App from '@/App';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

describe('App-root', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(App, {
      localVue,
    });
    bridgeMessenger.sendAndWaitResponse.mockResolvedValueOnce({});
  });

  describe('App render', () => {
    it('should render with loading', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render without loading markup', async () => {
      expect.assertions(1);

      await global.flushPromises();

      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
