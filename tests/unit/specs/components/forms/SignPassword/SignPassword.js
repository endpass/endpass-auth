import { shallowMount, createLocalVue } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import SignPassword from '@/components/forms/SignPassword';
import setupI18n from '@/locales/i18nSetup';
import validation from '@/validation';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';

const localVue = createLocalVue();

const i18n = setupI18n(localVue);

localVue.use(VeeValidate);
localVue.use(validation);

describe('SignPassword', () => {
  let wrapper;
  let authStore;
  const createWrapper = options => {
    const store = createStore();
    const { authStore: authStoreModule, coreStore } = createStoreModules(store);

    authStore = authStoreModule;

    return shallowMount(SignPassword, {
      provide: {
        theme: 'default',
      },
      coreStore,
      localVue,
      i18n,
      sync: false,
      ...options,
    });
  };

  beforeEach(() => {
    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('SignPasswordForm');
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
      expect.assertions(8);

      const submitButton = wrapper.find('[data-test=submit-button]');

      expect(submitButton.attributes().isloading).toBeFalsy();
      expect(submitButton.attributes().disabled).toBeTruthy();

      wrapper.setProps({
        isLoading: true,
      });
      await wrapper.vm.$nextTick();
      expect(submitButton.attributes().isloading).toBeTruthy();
      expect(submitButton.attributes().disabled).toBeTruthy();

      wrapper.setProps({
        isLoading: false,
      });
      await wrapper.vm.$nextTick();

      expect(submitButton.attributes().isloading).toBeFalsy();
      expect(submitButton.attributes().disabled).toBeTruthy();

      wrapper.setData({ password: 'foo' });
      wrapper.setProps({
        isLoading: false,
      });
      await wrapper.vm.$nextTick();

      expect(submitButton.attributes().isloading).toBeFalsy();
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

    it('should logout on click logout button', async () => {
      expect.assertions(3);

      wrapper = createWrapper({
        propsData: {
          withLogoutBtn: true,
        },
      });
      authStore.setAuthByCode(200);
      bridgeMessenger.sendAndWaitResponse.mockResolvedValueOnce({});

      expect(authStore.isLogin).toBe(true);

      wrapper.find('[data-test=logout-button]').vm.$emit('click');

      await global.flushPromises();

      expect(wrapper.emitted().cancel).toBeTruthy();
      expect(authStore.isLogin).toBe(false);
    });
  });
});
