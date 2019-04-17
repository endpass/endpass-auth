import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ErrorScreen from '@/components/screens/public/Error.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('Error Screen', () => {
  let $route;
  let wrapper;

  beforeEach(() => {
    const coreModule = {
      actions: {
        dialogClose: jest.fn(),
      },
    };
    $route = {
      query: {
        error_hint: 'foo',
        error_description: 'bar',
      },
    };

    const store = new Vuex.Store({
      modules: {
        core: coreModule,
      },
    });
    wrapper = shallowMount(ErrorScreen, {
      localVue,
      store,
      mocks: {
        $route,
      },
    });
  });

  describe('render', () => {
    it('should correctly render Error component', () => {
      expect(wrapper.name()).toBe('Error');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
