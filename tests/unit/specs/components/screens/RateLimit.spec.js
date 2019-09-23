import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import RateLimit from '@/components/screens/RateLimit';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

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
      i18n,
      localVue,
    });
  });

  describe('render', () => {
    it('should render rate limit', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
