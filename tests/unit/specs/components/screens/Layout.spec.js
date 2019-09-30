import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Layout from '@/components/screens/Layout';
import createStoreModules from '@/store/createStoreModules';
import createStore from '@/store/createStore';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

describe('Layout', () => {
  let wrapper;
  let coreStore;

  beforeEach(() => {
    const router = new VueRouter();
    const store = createStore();
    const { coreStore: coreStoreModule } = createStoreModules(store);
    coreStore = coreStoreModule;
    wrapper = shallowMount(Layout, {
      coreStore,
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
