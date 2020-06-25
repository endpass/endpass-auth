import { shallowMount, createLocalVue } from '@vue/test-utils';
import ScopesForm from '@/components/forms/Scopes';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();

const i18n = setupI18n(localVue);

describe('Scopes', () => {
  const defaultProps = {
    appName: 'Foo',
  };
  let wrapper;

  const wapperFactory = (options = {}) =>
    shallowMount(ScopesForm, {
      localVue,
      i18n,
      ...options,
    });

  beforeEach(() => {
    wrapper = wapperFactory({
      propsData: {
        ...defaultProps,
      },
    });
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('ScopesForm');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render given scopes', () => {
      wrapper = wapperFactory({
        propsData: {
          ...defaultProps,
          scopesList: ['foo', 'bar'],
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should correctly disable submit button', () => {
      wrapper = wapperFactory({
        propsData: {
          ...defaultProps,
          isLoading: true,
        },
      });

      const submitButton = wrapper.find('[data-test=submit-button]');

      expect(submitButton.attributes().isloading).toBeTruthy();
      expect(submitButton.attributes().disabled).toBeTruthy();
    });
  });

  describe('behavior', () => {
    it('should submit form if all scopes are selected', () => {
      wrapper = wapperFactory({
        propsData: {
          ...defaultProps,
          isLoading: false,
          scopesList: ['foo', 'bar'],
        },
      });

      expect(wrapper.emitted().submit).toBeUndefined();

      wrapper.find('form').trigger('submit');

      expect(wrapper.emitted().submit).toEqual([[['foo', 'bar']]]);
    });
  });
});
