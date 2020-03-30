import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, regularPassword as password } from '@unitFixtures/auth';
import VeeValidate from 'vee-validate';
import SignUpView from '@/components/screens/Authenticator/modules/SignUp/SignUp.view';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(VeeValidate);

describe('SignUpView', () => {
  let wrapper;
  const createWrapper = (options, props) =>
    shallowMount(SignUpView, {
      provide: {
        theme: 'default',
      },
      localVue,
      i18n,
      propsData: {
        ...props,
      },
      sync: false,
      ...options,
    });

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('SignUpView');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render pasword form', () => {
      expect(wrapper.find('[data-test=auth-form]').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    const defaultEventParams = {
      email,
      isSignUp: true,
      password,
    };

    it('should emit submit event', async () => {
      expect.assertions(4);

      expect(wrapper.emitted().submit).toBeUndefined();

      wrapper.find('[data-test=email-input]').vm.$emit('input', email);
      wrapper.find('[data-test=password-input]').vm.$emit('input', password);
      wrapper
        .find('[data-test=confirm-password-input]')
        .vm.$emit('input', password);
      await global.flushPromises();

      expect(
        wrapper.find('[data-test=submit-button-auth]').attributes().disabled,
      ).toBeUndefined();

      wrapper.find('[data-test=auth-form]').trigger('submit');

      expect(wrapper.emitted().submit.length).toBe(1);
      expect(wrapper.emitted().submit[0]).toEqual([defaultEventParams]);
    });

    it('should emit sign-in event', () => {
      expect.assertions(3);

      expect(wrapper.emitted()['sign-in']).toBeUndefined();

      wrapper
        .find('[data-test=switch-to-sign-in]')
        .vm.$emit('click', { preventDefault: () => {} });

      expect(wrapper.emitted()['sign-in'].length).toBe(1);
      expect(wrapper.emitted()['sign-in'][0]).toEqual([]);
    });

    describe('error', () => {
      const error = i18n.t('components.compositeAuth.authFailed');

      it('should remove error if email is changed', async () => {
        expect.assertions(3);

        wrapper = createWrapper(null, {
          error,
        });

        expect(wrapper.find('[data-test=email-input]').attributes().error).toBe(
          error,
        );

        wrapper.find('[data-test=email-input]').vm.$emit('input', email);
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted()['update:error'].length).toBe(1);
        expect(wrapper.emitted()['update:error'][0]).toEqual(['']);
      });

      it('should remove error if password is changed', async () => {
        expect.assertions(3);

        wrapper = createWrapper(null, {
          error,
        });

        expect(wrapper.find('[data-test=email-input]').attributes().error).toBe(
          error,
        );

        wrapper.find('[data-test=password-input]').vm.$emit('input', email);
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted()['update:error'].length).toBe(1);
        expect(wrapper.emitted()['update:error'][0]).toEqual(['']);
      });

      it('should remove error if confirm password is changed', async () => {
        expect.assertions(3);

        wrapper = createWrapper(null, {
          error,
        });

        expect(wrapper.find('[data-test=email-input]').attributes().error).toBe(
          error,
        );

        wrapper
          .find('[data-test=confirm-password-input]')
          .vm.$emit('input', email);
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted()['update:error'].length).toBe(1);
        expect(wrapper.emitted()['update:error'][0]).toEqual(['']);
      });
    });

    describe('social', () => {
      it('should emit social event', () => {
        expect.assertions(3);

        expect(wrapper.emitted().social).toBeUndefined();

        wrapper.find('google-auth-button-stub').vm.$emit('submit');

        expect(wrapper.emitted().social.length).toBe(1);
        expect(wrapper.emitted().social[0]).toEqual([]);
      });

      it('should update error if social failed', () => {
        expect.assertions(3);

        expect(wrapper.emitted()['update:error']).toBeUndefined();

        wrapper.find('google-auth-button-stub').vm.$emit('error');

        expect(wrapper.emitted()['update:error'].length).toBe(1);
        expect(wrapper.emitted()['update:error'][0]).toEqual([
          i18n.t('components.compositeAuth.authFailed'),
        ]);
      });
    });
  });

  describe('validation', () => {
    describe('email input', () => {
      it('should pass initial email', () => {
        const initialEmail = 'init@email.email';

        wrapper = createWrapper(null, {
          initialEmail,
        });

        expect(wrapper.find('[data-test=email-input]').attributes().value).toBe(
          initialEmail,
        );
      });

      it('should not show error by default', () => {
        expect(
          wrapper.find('[data-test=email-input]').attributes().error,
        ).toBeFalsy();
      });

      it('should not show error with valid email', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=email-input]').vm.$emit('input', email);
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=email-input]').attributes().error,
        ).toBeFalsy();
      });

      it('should show error with invalid email', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=email-input]').vm.$emit('input', 'invalid');
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=email-input]').attributes().error,
        ).toMatch('valid email');
      });

      it('should show error with empty email', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=email-input]').vm.$emit('input', email);
        await global.flushPromises();
        wrapper.find('[data-test=email-input]').vm.$emit('input', '');
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=email-input]').attributes().error,
        ).toMatch('required');
      });
    });

    describe('submit button', () => {
      it('should disable submit by default', () => {
        expect(
          wrapper.find('[data-test=submit-button-auth]').attributes().disabled,
        ).toBe('true');
      });

      describe('fill form before enter', () => {
        beforeEach(async () => {
          wrapper.find('[data-test=email-input]').vm.$emit('input', email);
          wrapper
            .find('[data-test=password-input]')
            .vm.$emit('input', password);
          wrapper
            .find('[data-test=confirm-password-input]')
            .vm.$emit('input', password);
          await global.flushPromises();
        });

        it('should enable submit with valid data', () => {
          expect.assertions(1);

          expect(
            wrapper.find('[data-test=submit-button-auth]').attributes()
              .disabled,
          ).toBeUndefined();
        });

        it('should disable submit with invalid email', async () => {
          expect.assertions(1);

          wrapper.find('[data-test=email-input]').vm.$emit('input', 'invalid');
          await global.flushPromises();

          expect(
            wrapper.find('[data-test=submit-button-auth]').attributes()
              .disabled,
          ).toBe('true');
        });

        it('should disable submit with invalid password', async () => {
          expect.assertions(1);

          wrapper.find('[data-test=password-input]').vm.$emit('input', 'short');
          await global.flushPromises();

          expect(
            wrapper.find('[data-test=submit-button-auth]').attributes()
              .disabled,
          ).toBe('true');
        });

        it('should disable submit with invalid confirm password', async () => {
          expect.assertions(1);

          wrapper
            .find('[data-test=confirm-password-input]')
            .vm.$emit('input', 'short');
          await global.flushPromises();

          expect(
            wrapper.find('[data-test=submit-button-auth]').attributes()
              .disabled,
          ).toBe('true');
        });

        it('should disable submit with not matched passwords', async () => {
          expect.assertions(1);

          wrapper
            .find('[data-test=password-input]')
            .vm.$emit('input', `${password}1`);
          await wrapper.vm.$nextTick();

          expect(
            wrapper.find('[data-test=submit-button-auth]').attributes()
              .disabled,
          ).toBe('true');
        });
      });
    });
  });
});
