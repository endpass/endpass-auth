import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email } from '@unitFixtures/auth';
import VeeValidate from 'vee-validate';
import SignInView from '@/components/screens/Authenticator/modules/SignIn/SignIn.view';
import setupI18n from '@/locales/i18nSetup';
import { IDENTITY_MODE } from '@/constants';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(VeeValidate);

describe('SignInView', () => {
  let wrapper;
  const createWrapper = (options, props) =>
    shallowMount(SignInView, {
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
      expect(wrapper.name()).toBe('SignInView');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render pasword form', () => {
      expect(wrapper.find('[data-test=auth-form]').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    const defaultServerMode = {
      type: IDENTITY_MODE.DEFAULT,
      serverUrl: undefined,
    };
    const defaultEventParams = {
      email,
      serverMode: defaultServerMode,
    };

    it('should emit submit event', async () => {
      expect.assertions(4);

      expect(wrapper.emitted().submit).toBeUndefined();

      wrapper.find('[data-test=email-input]').vm.$emit('input', email);
      await global.flushPromises();

      expect(
        wrapper.find('[data-test=submit-button-auth]').attributes().disabled,
      ).toBeUndefined();

      wrapper.find('[data-test=auth-form]').trigger('submit');

      expect(wrapper.emitted().submit.length).toBe(1);
      expect(wrapper.emitted().submit[0]).toEqual([defaultEventParams]);
    });

    it('should emit sign-up event', () => {
      expect.assertions(3);

      expect(wrapper.emitted()['sign-up']).toBeUndefined();

      wrapper
        .find('[data-test=switch-to-sign-up]')
        .vm.$emit('click', { preventDefault: () => {} });

      expect(wrapper.emitted()['sign-up'].length).toBe(1);
      expect(wrapper.emitted()['sign-up'][0]).toEqual([]);
    });

    it('should remove error if email is changed', async () => {
      expect.assertions(3);

      const error = i18n.t('components.compositeAuth.authFailed');
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
      it('should not show error by default', () => {
        expect(
          wrapper.find('[data-test=email-input]').attributes().error,
        ).toBeUndefined();
      });

      it('should not show error with valid email', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=email-input]').vm.$emit('input', email);
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=email-input]').attributes().error,
        ).toBeUndefined();
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
          await global.flushPromises();
        });

        it('should enable submit with valid data', async () => {
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
      });
    });
  });
});
