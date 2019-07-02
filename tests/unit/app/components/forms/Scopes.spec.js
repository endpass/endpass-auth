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

    it('should render checkboxes with given scopes', () => {
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

      expect(submitButton.text()).toBe('Loading...');
      expect(submitButton.attributes().disabled).toBeTruthy();

      wrapper.setProps({
        isLoading: false,
        scopesList: ['foo', 'bar'],
      });
      wrapper.vm.onChange({ foo: false, bar: false });

      expect(submitButton.text()).toBe('Allow');
      expect(submitButton.attributes().disabled).toBeTruthy();

      wrapper.setProps({
        isLoading: false,
        scopesList: ['foo', 'bar'],
      });
      wrapper.vm.onChange({ foo: true, bar: false });

      expect(submitButton.attributes().disabled).toBeFalsy();
    });
  });

  describe('behavior', () => {
    it('should submit form if all scopes are selected', () => {
      wrapper.setProps({
        isLoading: false,
        scopesList: ['foo', 'bar'],
      });
      wrapper.vm.onChange({ foo: true, bar: true });
      wrapper.find('form').trigger('submit');

      expect(wrapper.emitted().submit).toEqual([[['foo', 'bar']]]);
    });

    it('should not submit form if no one scope is not selected', () => {
      wrapper.setProps({
        isLoading: false,
        scopesList: ['foo', 'bar'],
      });
      wrapper.vm.onChange({ foo: false, bar: false });
      wrapper.find('form').trigger('submit');

      expect(wrapper.emitted().submit).toBeFalsy();
    });

    it('should emit cancel event on cancel click', () => {
      wrapper.setProps({
        isLoading: false,
        scopesList: ['foo', 'bar'],
      });

      wrapper.find('[data-test="cancel-button"]').vm.$emit('click');
      expect(wrapper.emitted().cancel).toBeTruthy();
    });
  });
});
