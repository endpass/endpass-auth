import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import RateLimit from '@/components/screens/Layout';
import createStore from '@/store/createStore';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

describe('Layout', () => {
  function creator(coreStore = {}) {
    const router = new VueRouter();
    const store = createStore();
    return shallowMount(RateLimit, {
      store,
      router,
      localVue,
      coreStore,
    });
  }

  describe('render', () => {
    it('should render router', () => {
      const wrapper = creator({
        isRateLimit: false,
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render rate limit', () => {
      const wrapper = creator({
        isRateLimit: true,
      });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
