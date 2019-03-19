import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Bridge from '@/App';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

describe('App-root', () => {
  let wrapper;
  let store;
  let coreModule;

  beforeEach(() => {
    coreModule = {
      actions: {
        init: jest.fn(),
      },
      getters: {
        isDialog: jest.fn(),
      },
    };
    const router = new VueRouter();
    store = new Vuex.Store({
      router,
      modules: {
        core: coreModule,
      },
    });

    wrapper = shallowMount(Bridge, {
      store,
      localVue,
    });
  });

  describe('App render', () => {
    it('should render "empty" markup', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('App behavior', () => {
    it('should subscribe on bride after create', () => {
      expect(coreModule.actions.init).toBeCalled();
    });
  });
});
