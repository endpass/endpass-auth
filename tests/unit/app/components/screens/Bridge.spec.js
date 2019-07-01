import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Bridge from '@/components/screens/Bridge.vue';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();

const i18n = setupI18n(localVue);
localVue.use(Vuex);

describe('Bridge', () => {
  let wrapper;
  let store;
  let coreModule;

  beforeEach(() => {
    coreModule = {
      actions: {
        subscribeOnBridge: jest.fn(),
      },
    };
    store = new Vuex.Store({
      modules: {
        core: coreModule,
      },
    });
    wrapper = shallowMount(Bridge, {
      store,
      i18n,
      localVue,
    });
  });

  describe('render', () => {
    it('should render "empty" markup', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should subscribe on bride after create', () => {
      expect(coreModule.actions.subscribeOnBridge).not.toBeCalled();
    });
  });
});
