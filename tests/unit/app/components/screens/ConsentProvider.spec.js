import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ConsentProvider from '@/components/screens/ConsentProvider';

jest.mock('@/util/url', () => ({
  queryParamsToObject: jest.fn().mockImplementation(() => ({
    consentChallenge: 'foo',
  })),
}));

/* eslint-disable-next-line */
import { queryParamsToObject } from '@/util/url';

const localVue = createLocalVue();

localVue.use(VueRouter);
localVue.use(Vuex);

describe('ConsentProvider', () => {
  let wrapper;
  let router;
  let store;
  let storeData;
  let coreModule;
  let accountsModule;

  beforeEach(() => {
    jest.clearAllMocks();

    coreModule = {
      state: {
        loading: false,
      },
    };
    accountsModule = {
      state: {
        isAuthorized: true,
      },
      actions: {
        grantPermissionsWithHydra: jest.fn(),
      },
    };
    storeData = {
      modules: {
        accounts: accountsModule,
        core: coreModule,
      },
    };
    store = new Vuex.Store(storeData);
    router = new VueRouter();
    wrapper = shallowMount(ConsentProvider, {
      localVue,
      store,
      router,
    });
  });

  describe('render', () => {
    it('should correctly render ConsentProvider screen', () => {
      queryParamsToObject.mockImplementationOnce(() => ({
        consentChallenge: 'foo',
        scopes: 'foo+bar+baz',
      }));
      wrapper = shallowMount(ConsentProvider, {
        localVue,
        store,
        router,
      });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    beforeEach(() => {
      router.replace = jest.fn();
    });

    it('should takes query params from current location and assign error if consentChallenge is not in params', () => {
      expect(wrapper.vm.error).not.toBeNull();
      expect(wrapper.vm.$router.replace).not.toBeCalled();
    });

    it('should takes query params from current location and assign error if scopes is not in params', () => {
      wrapper = shallowMount(ConsentProvider, {
        localVue,
        store,
        router,
      });

      expect(wrapper.vm.error).not.toBeNull();
      expect(wrapper.vm.$router.replace).not.toBeCalled();
    });

    it('should takes query params from current location and makes redirect if consentChallenge is not empty but authorization status is falsy', () => {
      queryParamsToObject.mockImplementationOnce(() => ({
        consentChallenge: 'foo',
        scopes: 'foo bar baz',
      }));
      accountsModule.state.isAuthorized = false;
      wrapper = shallowMount(ConsentProvider, {
        localVue,
        store,
        router,
      });

      expect(wrapper.vm.$router.replace).toBeCalled();
    });

    it('should not do anything on mounting if challengeId is present in query params and user authorized', () => {
      queryParamsToObject.mockReturnValueOnce({
        consentChallenge: 'foo',
        scopes: 'foo bar baz',
      });
      wrapper = shallowMount(ConsentProvider, {
        localVue,
        store,
        router,
      });

      expect(wrapper.vm.error).toBeNull();
      expect(wrapper.vm.$router.replace).not.toBeCalled();
    });

    it('should grant permissions on scopes form submit', () => {
      queryParamsToObject.mockReturnValueOnce({
        consentChallenge: 'foo',
        scopes: 'foo bar baz',
      });
      wrapper = shallowMount(ConsentProvider, {
        localVue,
        store,
        router,
      });

      wrapper
        .find('scopes-form-stub')
        .vm.$emit('submit', ['foo', 'bar', 'baz']);

      expect(accountsModule.actions.grantPermissionsWithHydra).toBeCalledWith(
        expect.any(Object),
        {
          consentChallenge: 'foo',
          scopes: ['foo', 'bar', 'baz'],
        },
        undefined,
      );
    });

    it('should not grant permissions on scopes form submit if consentChallenge is not in params', () => {
      wrapper.setData({
        params: {
          consentChallenge: null,
        },
      });

      wrapper.find('scopes-form-stub').vm.$emit('submit');

      expect(accountsModule.actions.grantPermissionsWithHydra).not.toBeCalled();
    });
  });
});
