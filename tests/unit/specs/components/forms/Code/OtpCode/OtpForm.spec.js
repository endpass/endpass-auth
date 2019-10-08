import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VeeValidate from 'vee-validate';
import OtpForm from '@/components/forms/Code/OtpCode/OtpForm';
import setupI18n from '@/locales/i18nSetup';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VeeValidate);
const i18n = setupI18n(localVue);

describe('OtpForm', () => {
  let wrapper;
  let coreStore;
  const isSignUp = false;
  const submitHandler = jest.fn();
  const email = 'email';
  const password = 'password';
  const code = '123456';

  const createPrevent = () => ({
    preventDefault: () => {},
  });

  beforeEach(() => {
    jest.clearAllMocks();

    const store = createStore();
    const { coreStore: coreStoreModule } = createStoreModules(store);

    coreStore = coreStoreModule;

    wrapper = shallowMount(OtpForm, {
      coreStore,
      localVue,
      propsData: {
        email,
        password,
        isSignUp,
        submitHandler,
      },
      provide: {
        theme: 'default',
      },
      i18n,
      sync: false,
    });
  });

  describe('render', () => {
    it('should correctly render Otp component', () => {
      expect(wrapper.name()).toBe('OtpForm');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should correctly disable submit button', async () => {
      expect.assertions(2);

      const submitButton = wrapper.find('[data-test=submit-button]');

      expect(submitButton.attributes().disabled).toBeTruthy();

      wrapper.find('[data-test=code-input]').vm.$emit('input', code);
      await global.flushPromises();

      expect(submitButton.attributes().disabled).toBeUndefined();
    });

    it('should render error if submit handler failed', async () => {
      expect.assertions(2);

      submitHandler.mockRejectedValueOnce(new Error());

      expect(
        wrapper.find('[data-test=code-input]').attributes().error,
      ).toBeUndefined();

      wrapper.find('[data-test=code-input]').vm.$emit('input', code);
      wrapper.find('form').trigger('submit');

      await global.flushPromises();

      expect(wrapper.find('[data-test=code-input]').attributes().error).toBe(
        'Authentication failed. Please, try again',
      );
    });
  });

  describe('behavior', () => {
    it('should call submit handler', async () => {
      expect.assertions(1);

      wrapper.find('[data-test=code-input]').vm.$emit('input', code);
      wrapper.find('form').trigger('submit');

      await global.flushPromises();

      expect(submitHandler).toBeCalledWith({ code, email, isSignUp, password });
    });

    it('should not emit recover event', () => {
      wrapper.find('form').trigger('submit');
      wrapper
        .find('[data-test=recovery-link]')
        .vm.$emit('click', createPrevent());

      expect(wrapper.emitted().recover).toBe(undefined);
    });

    it('should emit recover event', () => {
      wrapper
        .find('[data-test=recovery-link]')
        .vm.$emit('click', createPrevent());

      expect(wrapper.emitted().recover).toEqual([[]]);
    });
  });
});
