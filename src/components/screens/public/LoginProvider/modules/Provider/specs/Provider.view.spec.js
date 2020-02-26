import { shallowMount, createLocalVue } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import Provider from '@/components/screens/public/LoginProvider/modules/Provider/Provider.view';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(VeeValidate);

describe('Provider', () => {
  let wrapper;
  const createWrapper = (options, props) =>
    shallowMount(Provider, {
      provide: {
        theme: 'default',
      },
      propsData: {
        isLoading: false,
        isClosable: false,
        ...props,
      },
      localVue,
      sync: false,
      i18n,
    });

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('ProviderView');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit close', () => {
      expect(wrapper.emitted().close).toBeUndefined();

      wrapper.find('v-frame-stub').vm.$emit('close');

      expect(wrapper.emitted().close).toHaveLength(1);
      expect(wrapper.emitted().close).toEqual([[]]);
    });
  });
});
