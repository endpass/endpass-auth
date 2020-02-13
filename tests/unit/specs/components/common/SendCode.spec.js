import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import SendCode from '@/components/common/SendCode';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

const createPrevent = () => ({
  preventDefault: () => {},
});

describe('SendCode', () => {
  const wrapperFactory = (options = {}) =>
    shallowMount(SendCode, {
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
      expect(wrapper.name()).toBe('SendCode');
    });
  });

  describe('behavior', () => {
    it('should emit send code on click by link', async () => {
      expect.assertions(1);

      await global.flushPromises();

      wrapper.find('[data-test=send-code]').vm.$emit('click', createPrevent());

      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('click')).toBeTruthy();
    });

    // it('should not emit anything on change if disabled', () => {
    //   wrapper = wrapperFactory({
    //     propsData: {
    //       level: tree,
    //       children: tree.children,
    //       disabled: true,
    //       valuesMap,
    //     },
    //   });
    //   wrapper.find('v-checkbox-stub').vm.$emit('change', false);

    //   expect(wrapper.emitted().change).toBeUndefined();
    // });

    // it('should not emit anything on level change if disabled', () => {
    //   wrapper = wrapperFactory({
    //     propsData: {
    //       level: tree,
    //       children: tree.children,
    //       disabled: true,
    //       valuesMap,
    //     },
    //   });
    //   wrapper.find('scopes-checkbox-tree-stub').vm.$emit('change', {});

    //   expect(wrapper.emitted().change).toBeUndefined();
    // });
  });
});
