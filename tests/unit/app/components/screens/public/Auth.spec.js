import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Auth from '@/components/screens/public/Auth.vue';
import queryStringToMap from '@endpass/utils/queryStringToMap';

jest.mock('@endpass/utils/queryStringToMap', () =>
  jest.fn().mockImplementation(() => ({
    redirect_url: 'http://foo.bar',
  })),
);

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

describe('PublicAuth', () => {
  let wrapper;
  let router;
  let store;
  let storeData;
  let accountsModule;

  beforeEach(() => {
    jest.clearAllMocks();

    router = new VueRouter();
    accountsModule = {
      mutations: {
        setAuthParams: jest.fn(),
      },
    };
    storeData = {
      modules: {
        accounts: accountsModule,
      },
    };
    store = new Vuex.Store(storeData);
    wrapper = shallowMount(Auth, {
      localVue,
      router,
      store,
    });
  });

  describe('render', () => {
    it('should correctly render Auth public screen component', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should redirect to LoginProvider on auth form authorize event handling', () => {
      wrapper.setData({
        queryParamsMap: {
          redirect_url: 'http://localhost/public/foo/bar',
        },
      });
      wrapper.vm.$router.replace = jest.fn();
      wrapper.find('composite-auth-form-stub').vm.$emit('authorize');

      expect(wrapper.vm.$router.replace).toBeCalledWith('/public/foo/bar');
    });

    it('should set auth params if redirectUrl exists', () => {
      expect(accountsModule.mutations.setAuthParams).toBeCalledWith(
        expect.any(Object),
        {
          redirectUrl: 'http://foo.bar',
        },
      );
    });

    it('should not set auth params if redirectUrl not exists', () => {
      queryStringToMap.mockImplementation(() => ({}));
      accountsModule.mutations.setAuthParams.mockRestore();
      wrapper = shallowMount(Auth, {
        localVue,
        router,
        store,
      });

      expect(accountsModule.mutations.setAuthParams).not.toBeCalled();
    });
  });
});
