import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import RequestCode from '@/components/common/SendCode/layouts/RequestCode';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

const createPrevent = () => ({
  preventDefault: () => {},
});

describe('SendCode / RequestCodeLayout', () => {
  const wrapperFactory = (options = {}) =>
    shallowMount(RequestCode, {
      localVue,
      i18n,
      propsData: {
        isLoading: false,
      },
      ...options,
    });
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = wrapperFactory();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('RequestCode');
    });
  });

  describe('behavior', () => {
    it('should emit by click on link', async () => {
      expect.assertions(2);

      await global.flushPromises();

      wrapper.find('[data-test=send-code]').vm.$emit('click', createPrevent());

      expect(wrapper.emitted('click')).toBeTruthy();
      expect(wrapper.emitted('update:is-locked')).toBeTruthy();
    });
  });
});
