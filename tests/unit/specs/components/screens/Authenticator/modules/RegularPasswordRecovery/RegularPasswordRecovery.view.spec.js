import { shallowMount, createLocalVue } from '@vue/test-utils';
import {
  email,
  regularPassword as password,
  anotherPasswordWithEqualLength,
  code,
} from '@unitFixtures/auth';
import VeeValidate from 'vee-validate';
import RegularPasswordRecoveryView from '@/components/screens/Authenticator/modules/RegularPasswordRecovery/RegularPasswordRecovery.view';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(VeeValidate);

describe('RegularPasswordRecoveryView', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(RegularPasswordRecoveryView, {
      provide: {
        theme: 'default',
      },
      propsData: {
        email,
      },
      localVue,
      sync: false,
      i18n,
    });
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('RegularPasswordRecoveryView');
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
    it('should emit submit event', async () => {
      expect.assertions(4);

      expect(wrapper.emitted().submit).toBeUndefined();

      wrapper.find('[data-test=password-input]').vm.$emit('input', password);
      wrapper
        .find('[data-test=repeat-password-input]')
        .vm.$emit('input', password);
      wrapper.find('[data-test=code-input]').vm.$emit('input', code);
      await global.flushPromises();

      expect(
        wrapper.find('[data-test=submit-button]').attributes().disabled,
      ).toBeUndefined();

      wrapper.find('[data-test=regular-password-form]').trigger('submit');

      expect(wrapper.emitted().submit.length).toBe(1);
      expect(wrapper.emitted().submit[0]).toEqual([{ password, code }]);
    });

    it('should emit send code event', () => {
      expect(wrapper.emitted()['send-code']).toBeUndefined();

      wrapper.find('[data-test=send-code-button]').vm.$emit('click');

      expect(wrapper.emitted()['send-code'].length).toBe(1);
      expect(wrapper.emitted()['send-code'][0]).toEqual([]);
    });
  });

  describe('validation', () => {
    describe('password input', () => {
      it('should not show error by default', () => {
        expect(
          wrapper.find('[data-test=password-input]').attributes().error,
        ).toBeUndefined();
      });

      it('should not show error with valid password', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=password-input]').vm.$emit('input', password);
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=password-input]').attributes().error,
        ).toBeUndefined();
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

    describe('confirm password input', () => {
      it('should not show error by default', () => {
        expect(
          wrapper.find('[data-test=repeat-password-input]').attributes().error,
        ).toBeUndefined();
      });

      it('should not show error with valid password', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=password-input]').vm.$emit('input', password);
        wrapper
          .find('[data-test=repeat-password-input]')
          .vm.$emit('input', password);
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=repeat-password-input]').attributes().error,
        ).toBeUndefined();
      });

      it('should show error with invalid password', async () => {
        expect.assertions(1);

        wrapper
          .find('[data-test=repeat-password-input]')
          .vm.$emit('input', 'short');
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=repeat-password-input]').attributes().error,
        ).toMatch('not match');
      });

      it('should show error with empty password', async () => {
        expect.assertions(1);

        wrapper
          .find('[data-test=repeat-password-input]')
          .vm.$emit('input', 'short');
        await global.flushPromises();
        wrapper.find('[data-test=repeat-password-input]').vm.$emit('input', '');
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=repeat-password-input]').attributes().error,
        ).toMatch('required');
      });

      it('should show error with not matched password', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=password-input]').vm.$emit('input', password);
        wrapper
          .find('[data-test=repeat-password-input]')
          .vm.$emit('input', anotherPasswordWithEqualLength);
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=repeat-password-input]').attributes().error,
        ).toMatch('not match');
      });
    });

    describe('code input', () => {
      it('should not show error by default', () => {
        expect(
          wrapper.find('[data-test=code-input]').attributes().error,
        ).toBeUndefined();
      });

      it('should not show error with valid code', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=code-input]').vm.$emit('input', code);
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=code-input]').attributes().error,
        ).toBeUndefined();
      });

      it('should show error with short code', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=code-input]').vm.$emit('input', '1');
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=code-input]').attributes().error,
        ).toMatch('exactly');
      });

      it('should show error with string code', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=code-input]').vm.$emit('input', 'short');
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=code-input]').attributes().error,
        ).toMatch('numeric');
      });

      it('should show error with empty code', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=code-input]').vm.$emit('input', code);
        await global.flushPromises();
        wrapper.find('[data-test=code-input]').vm.$emit('input', '');
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=code-input]').attributes().error,
        ).toMatch('required');
      });
    });

    describe('submit button', () => {
      it('should disable submit by default', () => {
        expect(
          wrapper.find('[data-test=submit-button]').attributes().disabled,
        ).toBe('true');
      });

      describe('fill form before enter', () => {
        beforeEach(async () => {
          wrapper
            .find('[data-test=password-input]')
            .vm.$emit('input', password);
          wrapper
            .find('[data-test=repeat-password-input]')
            .vm.$emit('input', password);
          wrapper.find('[data-test=code-input]').vm.$emit('input', code);
          await global.flushPromises();
        });

        it('should enable submit with valid data', async () => {
          expect.assertions(1);

          expect(
            wrapper.find('[data-test=submit-button]').attributes().disabled,
          ).toBeUndefined();
        });

        it('should disable submit with invalid password', async () => {
          expect.assertions(1);

          wrapper.find('[data-test=password-input]').vm.$emit('input', 'short');
          await global.flushPromises();

          expect(
            wrapper.find('[data-test=submit-button]').attributes().disabled,
          ).toBe('true');
        });

        it('should disable submit with invalid confirm password', async () => {
          expect.assertions(1);

          wrapper
            .find('[data-test=repeat-password-input]')
            .vm.$emit('input', 'short');
          await global.flushPromises();

          expect(
            wrapper.find('[data-test=submit-button]').attributes().disabled,
          ).toBe('true');
        });

        it("should disable submit when confirm password doesn't match", async () => {
          expect.assertions(1);

          wrapper
            .find('[data-test=repeat-password-input]')
            .vm.$emit('input', anotherPasswordWithEqualLength);
          await global.flushPromises();

          expect(
            wrapper.find('[data-test=submit-button]').attributes().disabled,
          ).toBe('true');
        });

        it('should disable submit with invalid code', async () => {
          expect.assertions(1);

          wrapper.find('[data-test=code-input]').vm.$emit('input', '1');
          await global.flushPromises();

          expect(
            wrapper.find('[data-test=submit-button]').attributes().disabled,
          ).toBe('true');
        });
      });
    });
  });
});
