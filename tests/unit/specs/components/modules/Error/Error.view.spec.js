import { shallowMount, createLocalVue } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import ErrorView from '@/components/modules/Error/Error.view';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(VeeValidate);

describe('ErrorView', () => {
  let wrapper;

  const createWrapper = (options, props) =>
    shallowMount(ErrorView, {
      provide: {
        theme: 'default',
      },
      propsData: {
        error: '',
        ...props,
      },
      localVue,
      sync: false,
      i18n,
      ...options,
    });

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('ErrorView');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render error', () => {
      const error = 'check error';
      wrapper = createWrapper(null, {
        error,
      });
      expect(wrapper.find('[data-test=error-message]').text()).toMatch(error);
    });
  });
});
