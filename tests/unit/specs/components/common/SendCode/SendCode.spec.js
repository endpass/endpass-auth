import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import SendCode from '@/components/common/SendCode';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

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

    it('should render RequestCode layout', async () => {
      expect.assertions(1);

      await global.flushPromises();

      expect(wrapper.find('requestcode-stub').exists()).toBeTruthy();
    });

    it('should render CodeRequested layout if it locked', async () => {
      expect.assertions(1);

      wrapper.setData({
        isLocked: true,
      });

      await global.flushPromises();

      expect(wrapper.find('countlabel-stub').exists()).toBeTruthy();
    });
  });
});
