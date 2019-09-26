import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import RateLimit from '@/components/screens/RateLimit';
import setupI18n from '@/locales/i18nSetup';
import { coreStore } from '@/store';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('RateLimit', () => {
  let wrapper;
  beforeEach(() => {
    coreStore.setRateLimitTimeout(10);
    wrapper = shallowMount(RateLimit, {
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
