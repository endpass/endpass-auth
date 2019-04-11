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
        scopes: ['foo', 'bar'],
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render error', () => {
      const error = 'error';

      wrapper.setProps({ error });

      expect(wrapper.find('[data-test=error-message]').text()).toBe(error);
    });

    it('should correctly disable submit button', () => {
      const submitButton = wrapper.find('[data-test=submit-button]');

      wrapper.setProps({
        loading: true,
      });

      expect(submitButton.text()).toBe('Loading...');
      expect(submitButton.attributes().disabled).toBeTruthy();

      wrapper.setProps({
        loading: false,
      });

      expect(submitButton.text()).toBe('Allow');
      expect(submitButton.attributes().disabled).toBeFalsy();

      wrapper.setProps({
        loading: false,
        scopes: ['foo', 'bar'],
      });
      wrapper.setData({ checkedScopes: [] });

      expect(submitButton.attributes().disabled).toBeTruthy();

      wrapper.setProps({
        loading: false,
        scopes: ['foo', 'bar'],
      });
      wrapper.setData({ checkedScopes: ['foo', 'bar'] });

      expect(submitButton.attributes().disabled).toBeFalsy();
    });
  });

  describe('behavior', () => {
    it('should submit form if all scopes are selected', () => {
      wrapper.setProps({
        loading: false,
        scopes: ['foo', 'bar'],
      });
      wrapper.setData({ checkedScopes: ['foo', 'bar'] });

      wrapper.find('form').trigger('submit');

      expect(wrapper.emitted().submit).toEqual([[['foo', 'bar']]]);
    });

    it('should not submit form if at least one scope is not selected', () => {
      wrapper.setProps({
        loading: false,
        scopes: ['foo', 'bar'],
      });
      wrapper.setData({ checkedScopes: [] });

      wrapper.find('form').trigger('submit');

      expect(wrapper.emitted().submit).toBeFalsy();
    });
  });
});
