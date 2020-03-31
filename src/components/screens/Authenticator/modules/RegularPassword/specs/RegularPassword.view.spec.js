import { shallowMount, createLocalVue } from '@vue/test-utils';
import { regularPassword as password } from '@unitFixtures/auth';
import VeeValidate from 'vee-validate';
import RegularPasswordView from '@/components/screens/Authenticator/modules/RegularPassword/RegularPassword.view';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(VeeValidate);

describe('RegularPasswordView', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(RegularPasswordView, {
      provide: {
        theme: 'default',
      },
      localVue,
      sync: false,
      i18n,
    });
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('RegularPasswordView');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render pasword form', () => {
      expect(wrapper.find('[data-test=regular-password-form]').exists()).toBe(
        true,
      );
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should enabled submit button', async () => {
      expect.assertions(2);

      expect(
        wrapper.find('[data-test=submit-button]').attributes().disabled,
      ).toBeTruthy();

      wrapper.find('[data-test=password-input]').vm.$emit('input', password);

      await global.flushPromises();

      expect(
        wrapper.find('[data-test=submit-button]').attributes().disabled,
      ).toBeUndefined();
    });

    it('should emit submit password event', () => {
      expect(wrapper.emitted().submit).toBeUndefined();

      wrapper.find('[data-test=password-input]').vm.$emit('input', password);

      wrapper.find('[data-test=regular-password-form]').trigger('submit');

      expect(wrapper.emitted().submit.length).toBe(1);
      expect(wrapper.emitted().submit[0]).toEqual([
        {
          password,
          isRemember: false,
        },
      ]);
    });

    it('should emit submit with remember me flag', async () => {
      expect(wrapper.emitted().submit).toBeUndefined();

      wrapper.find('[data-test=password-input]').vm.$emit('input', password);
      wrapper.find('[data-test=remember-me-checkbox]').vm.$emit('input', true);

      await global.flushPromises();

      wrapper.find('[data-test=regular-password-form]').trigger('submit');

      expect(wrapper.emitted().submit.length).toBe(1);
      expect(wrapper.emitted().submit[0]).toEqual([
        {
          password,
          isRemember: true,
        },
      ]);
    });

    it('should emit recover event', () => {
      expect(wrapper.emitted().recover).toBeUndefined();

      wrapper
        .find('[data-test=password-recover]')
        .vm.$emit('click', { preventDefault: () => {} });

      expect(wrapper.emitted().recover).toHaveLength(1);
      expect(wrapper.emitted().recover[0]).toEqual([]);
    });
  });

  describe('validation', () => {
    describe('password input', () => {
      it('should not show error by default', () => {
        expect(
          wrapper.find('[data-test=password-input]').attributes().error,
        ).toBeFalsy();
      });

      it('should not show error with valid password', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=password-input]').vm.$emit('input', password);
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=password-input]').attributes().error,
        ).toBeFalsy();
      });

      it('should show error with invalid password', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=password-input]').vm.$emit('input', 'short');
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=password-input]').attributes().error,
        ).toMatch('least');
      });

      it('should show error with empty password', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=password-input]').vm.$emit('input', 'short');
        await global.flushPromises();
        wrapper.find('[data-test=password-input]').vm.$emit('input', '');
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=password-input]').attributes().error,
        ).toMatch('required');
      });
    });

    describe('submit button', () => {
      it('should disable submit by default', () => {
        expect(
          wrapper.find('[data-test=submit-button]').attributes().disabled,
        ).toBe('true');
      });

      it('should enable submit with valid password', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=password-input]').vm.$emit('input', password);
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=submit-button]').attributes().disabled,
        ).toBeUndefined();
      });

      it('should disable submit with invalid password', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=password-input]').vm.$emit('input', password);
        await global.flushPromises();

        wrapper.find('[data-test=password-input]').vm.$emit('input', 'short');
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=submit-button]').attributes().disabled,
        ).toBe('true');
      });
    });
  });
});
