import { shallowMount, createLocalVue } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import PasswordForm from '@/components/forms/SignPassword/PasswordForm';
import setupI18n from '@/locales/i18nSetup';
import validation from '@/validation';

const localVue = createLocalVue();

const i18n = setupI18n(localVue);

localVue.use(VeeValidate);
localVue.use(validation);

describe('PasswordForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PasswordForm, {
      provide: {
        theme: 'default',
      },
      localVue,
      i18n,
      sync: false,
    });
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('PasswordForm');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render error', async () => {
      expect.assertions(1);

      const error = 'error';
      wrapper.setProps({ error });

      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-test=password-input]').attributes().error,
      ).toBe(error);
    });

    it('should correctly disable submit button', async () => {
      expect.assertions(6);

      const submitButton = wrapper.find('[data-test=submit-button]');

      wrapper.setProps({
        isLoading: true,
      });
      await wrapper.vm.$nextTick();

      expect(submitButton.text()).toBe('Loading...');
      expect(submitButton.attributes().disabled).toBeTruthy();

      wrapper.setProps({
        isLoading: false,
      });
      await wrapper.vm.$nextTick();

      expect(submitButton.text()).toBe('Apply');
      expect(submitButton.attributes().disabled).toBeTruthy();

      wrapper.setData({ password: 'foo' });
      wrapper.setProps({
        isLoading: false,
      });
      await wrapper.vm.$nextTick();

      expect(submitButton.text()).toBe('Apply');
      expect(submitButton.attributes().disabled).toBeTruthy();
    });

    it('should correctly enable submit button', async () => {
      expect.assertions(3);

      const submitButton = wrapper.find('[data-test=submit-button]');

      expect(submitButton.attributes().disabled).toBeTruthy();

      wrapper.setData({ password: 'biglongpassword' });
      wrapper.setProps({
        isLoading: false,
      });
      await global.flushPromises();

      expect(submitButton.text()).toBe('Apply');
      expect(submitButton.attributes().disabled).toBeUndefined();
    });

    it('should render email in password input label', async () => {
      expect.assertions(1);

      const email = 'foo@bar.baz';

      wrapper.setProps({
        isLoading: false,
        email,
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.find('v-input-stub').attributes().label).toContain(email);
    });
  });

  describe('behavior', () => {
    it('should not allow submit form if password is empty', async () => {
      expect.assertions(1);

      wrapper.setData({
        password: '',
      });
      await global.flushPromises();
      wrapper.find('form').trigger('submit');
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted().submit).toBe(undefined);
    });

    it('should submit form', async () => {
      expect.assertions(1);

      const password = 'foobigpassword';

      wrapper.setData({
        password,
      });
      await global.flushPromises();
      wrapper.find('form').trigger('submit');
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted().submit).toEqual([[password]]);
    });
  });
});
