import { shallowMount } from '@vue/test-utils';
import RecoverForm from '@/components/forms/Recover.vue';

describe('Otp', () => {
  const seedPhrase = 'foo bar foo bar foo bar foo bar foo bar foo bar';
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RecoverForm);
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('RecoverForm');
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

      expect(submitButton.text()).toBe('Recover access');
      expect(submitButton.attributes().disabled).toBeTruthy();

      wrapper.setProps({
        loading: false,
      });
      wrapper.setData({ seedPhrase });

      expect(submitButton.text()).toBe('Recover access');
      expect(submitButton.attributes().disabled).toBeUndefined();
    });
  });

  describe('behavior', () => {
    it('should not allow submit form if seed phrase is invalid', () => {
      const form = wrapper.find('form');

      wrapper.setData({
        seedPhrase: '',
      });

      form.trigger('submit');
      expect(wrapper.emitted().submit).toBe(undefined);

      wrapper.setData({
        seedPhrase: 'foo bar',
      });

      form.trigger('submit');
      expect(wrapper.emitted().submit).toBe(undefined);
    });

    it('should submit form', () => {
      wrapper.setData({ seedPhrase });

      wrapper.find('form').trigger('submit');
      expect(wrapper.emitted().submit).toEqual([[seedPhrase]]);
    });
  });
});
