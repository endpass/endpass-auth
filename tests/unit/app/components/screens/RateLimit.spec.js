import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import RateLimit from '@/components/screens/RateLimit';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('RateLimit', () => {
  let wrapper;
  let store;
  let coreModule;

  beforeEach(() => {
    coreModule = {
      state: {
        rateLimitTimeout: 10,
      },
    };
    store = new Vuex.Store({
      modules: {
        core: coreModule,
      },
    });
    wrapper = shallowMount(RateLimit, {
      store,
      localVue,
    });
  });

  describe('render', () => {
    it('should render rate limit', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
