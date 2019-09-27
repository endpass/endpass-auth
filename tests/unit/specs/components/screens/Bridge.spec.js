import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Bridge from '@/components/screens/Bridge';
import setupI18n from '@/locales/i18nSetup';
import createStore from '@/store/createStore';
import createStores from '@/store/createStores';

const localVue = createLocalVue();

const i18n = setupI18n(localVue);
localVue.use(Vuex);

describe('Bridge', () => {
  let wrapper;

  beforeEach(() => {
    const store = createStore();
    const { coreStore } = createStores(store);

    wrapper = shallowMount(Bridge, {
      coreStore,
      i18n,
      localVue,
    });
  });

  describe('render', () => {
    it('should render "empty" markup', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
