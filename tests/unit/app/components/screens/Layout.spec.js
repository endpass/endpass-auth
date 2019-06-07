import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import RateLimit from '@/components/screens/Layout';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

describe('Layout', () => {
  function creator(modules) {
    const router = new VueRouter();
    const store = new Vuex.Store({
      router,
      modules,
    });
    return shallowMount(RateLimit, {
      store,
      localVue,
    });
  }

  describe('render', () => {
    it('should render router', () => {
      const wrapper = creator({
        core: {
          getters: {
            isRateLimit: jest.fn(() => false),
          },
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render rate limit', () => {
      const wrapper = creator({
        core: {
          getters: {
            isRateLimit: jest.fn(() => true),
          },
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
