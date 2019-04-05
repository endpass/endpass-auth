import { shallowMount } from '@vue/test-utils';
import PasswordForm from '@/components/forms/Password';

describe('Password', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PasswordForm);
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('PasswordForm');
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

      expect(submitButton.text()).toBe('Submit');
      expect(submitButton.attributes().disabled).toBeTruthy();

      wrapper.setProps({
        loading: false,
      });
      wrapper.setData({ password: 'foo' });

      expect(submitButton.text()).toBe('Submit');
      expect(submitButton.attributes().disabled).toBeUndefined();
    });
  });

  describe('behavior', () => {
    it('should not allow submit form if password is empty', () => {
      wrapper.setData({
        password: '',
      });
      wrapper.find('form').trigger('submit');

      expect(wrapper.emitted().submit).toBe(undefined);
    });

    it('should submit form', () => {
      const password = 'foo';

      wrapper.setData({
        password,
      });
      wrapper.find('form').trigger('submit');

      expect(wrapper.emitted().submit).toEqual([[password]]);
    });
  });
});
