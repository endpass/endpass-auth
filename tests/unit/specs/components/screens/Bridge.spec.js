import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Bridge from '@/components/screens/Bridge';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();

const i18n = setupI18n(localVue);
localVue.use(Vuex);

describe('Bridge', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Bridge, {
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
