import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ErrorScreen from '@/components/screens/public/Error';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('Error Screen', () => {
  let $route;
  let wrapper;

  beforeEach(() => {
    $route = {
      query: {
        error_hint: 'foo',
        error_description: 'bar',
      },
    };

    const store = new Vuex.Store({});
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
