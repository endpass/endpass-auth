import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Auth from '@/components/screens/public/Auth.vue';

const localVue = createLocalVue();

localVue.use(VueRouter);

describe('PublicAuth', () => {
  let wrapper;
  let router;

  beforeEach(() => {
    jest.clearAllMocks();

    router = new VueRouter();
    wrapper = shallowMount(Auth, {
      localVue,
      router,
    });
  });

  describe('render', () => {
    it('should correclty render Auth public screen component', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should redirect to LoginProvider on auth form authorize event handling', () => {
      wrapper.vm.$router.replace = jest.fn();
      wrapper.find('composite-auth-form-stub').vm.$emit('authorize');

      expect(wrapper.vm.$router.replace).toBeCalledWith('/login');
    });
  });
});
