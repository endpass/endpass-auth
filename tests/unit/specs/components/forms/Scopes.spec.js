import { shallowMount, createLocalVue } from '@vue/test-utils';
import ScopesForm from '@/components/forms/Scopes';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();

const i18n = setupI18n(localVue);

describe('Scopes', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ScopesForm, {
      localVue,
      i18n,
    });
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('ScopesForm');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render given scopes', () => {
      wrapper.setProps({
        scopesList: ['foo', 'bar'],
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should correctly disable submit button', () => {
      const submitButton = wrapper.find('[data-test=submit-button]');

      wrapper.setProps({
        isLoading: true,
      });

      expect(submitButton.attributes().isloading).toBeTruthy();
      expect(submitButton.attributes().disabled).toBeTruthy();
    });
  });

  describe('behavior', () => {
    it('should submit form if all scopes are selected', () => {
      wrapper.setProps({
        isLoading: false,
        scopesList: ['foo', 'bar'],
      });

      expect(wrapper.emitted().submit).toBeUndefined();

      wrapper.find('form').trigger('submit');

      expect(wrapper.emitted().submit).toEqual([[['foo', 'bar']]]);
    });
  });
});
