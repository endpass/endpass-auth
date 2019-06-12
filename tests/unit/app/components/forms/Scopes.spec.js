import { shallowMount } from '@vue/test-utils';
import ScopesForm from '@/components/forms/Scopes';

describe('Scopes', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ScopesForm);
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
      });

      expect(submitButton.text()).toBe('Allow');
      expect(submitButton.attributes().disabled).toBeTruthy();

      wrapper.setProps({
        isLoading: false,
        scopesList: ['foo', 'bar'],
      });

      expect(submitButton.attributes().disabled).toBeFalsy();

      wrapper.vm.onChange({ foo: false, bar: false });

      expect(submitButton.attributes().disabled).toBeTruthy();
    });
  });

  describe('behavior', () => {
    it('should submit form if all scopes are selected', () => {
      wrapper.setProps({
        isLoading: false,
        scopesList: ['foo', 'bar'],
      });

      wrapper.vm.onChange({ foo: true, bar: false });

      wrapper.find('form').trigger('submit');

      expect(wrapper.emitted().submit).toEqual([[['foo']]]);
    });

    it('should not submit form if at least one scope is not selected', () => {
      wrapper.setProps({
        isLoading: false,
        scopesList: ['foo', 'bar'],
      });
      wrapper.vm.onChange({ foo: false, bar: false });

      wrapper.find('form').trigger('submit');

      expect(wrapper.emitted().submit).toBeFalsy();
    });
  });
});
