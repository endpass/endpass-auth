import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Layout from '@/components/screens/Layout';
import { coreStore } from '@/store';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

describe('Layout', () => {
  let wrapper;

  beforeEach(() => {
    const router = new VueRouter();
    wrapper = shallowMount(Layout, {
      router,
      localVue,
    });
  });

  describe('render', () => {
    it('should render router', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render rate limit', () => {
      coreStore.setRateLimitTimeout(50);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
