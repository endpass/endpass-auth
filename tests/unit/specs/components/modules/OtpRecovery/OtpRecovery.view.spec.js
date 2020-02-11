import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, code } from '@unitFixtures/auth';
import VeeValidate from 'vee-validate';
import OtpRecoveryView from '@/components/modules/code/RecoveryCode/OtpRecovery.view';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(VeeValidate);

describe('OtpRecoveryView', () => {
  let wrapper;
  const createWrapper = (options, props) =>
    shallowMount(OtpRecoveryView, {
      provide: {
        theme: 'default',
      },
      localVue,
      propsData: {
        email,
        ...props,
      },
      sync: false,
      i18n,
      ...options,
    });

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('OtpRecoveryView');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render form', () => {
      expect(wrapper.find('[data-test=recover-otp]').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('props', () => {
    describe('error', () => {
      it('should show error from prop', () => {
        expect.assertions(1);

        const error = 'error';

        wrapper = createWrapper(null, { error });

        expect(wrapper.find('[data-test=code-input]').attributes().error).toBe(
          error,
        );
      });

      it('should remove error when empty', async () => {
        expect.assertions(2);

        const error = 'error';

        wrapper = createWrapper(null, { error });
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-test=code-input]').attributes().error).toBe(
          error,
        );

        wrapper.setProps({ error: '' });
        await wrapper.vm.$nextTick();

        expect(
          wrapper.find('[data-test=code-input]').attributes().error,
        ).toBeUndefined();
      });

      it('should update error when not empty', () => {
        expect.assertions(2);

        const error = 'error';
        const newError = 'error';

        wrapper = createWrapper(null, { error });

        expect(wrapper.find('[data-test=code-input]').attributes().error).toBe(
          error,
        );

        wrapper.setProps({ error: newError });

        expect(wrapper.find('[data-test=code-input]').attributes().error).toBe(
          newError,
        );
      });
    });
  });

  describe('behavior', () => {
    describe('phone exist', () => {
      it('should emit submit event', async () => {
        expect.assertions(4);

        expect(wrapper.emitted().submit).toBeUndefined();

        wrapper.find('[data-test=code-input]').vm.$emit('input', code);
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=submit-button]').attributes().disabled,
        ).toBeUndefined();

        wrapper.find('[data-test=recover-otp]').trigger('submit');

        expect(wrapper.emitted().submit.length).toBe(1);
        expect(wrapper.emitted().submit[0]).toEqual([{ code }]);
      });

      it('should emit send code event', () => {
        expect(wrapper.emitted()['send-code']).toBeUndefined();

        wrapper
          .find('[data-test=recovery-link]')
          .vm.$emit('click', { preventDefault: () => {} });

        expect(wrapper.emitted()['send-code'].length).toBe(1);
        expect(wrapper.emitted()['send-code'][0]).toEqual([]);
      });
    });

    describe('phone is not exist', () => {
      beforeEach(() => {
        wrapper = createWrapper(null, { isPhoneExist: false });
      });

      it('should show message', () => {
        expect(wrapper.find('[data-test=phone-not-exist]').exists()).toBe(true);
      });

      it('should emit cancel event', () => {
        expect.assertions(4);

        expect(wrapper.emitted().cancel).toBeUndefined();

        expect(
          wrapper.find('[data-test=submit-button]').attributes().disabled,
        ).toBeUndefined();

        wrapper.find('[data-test=phone-not-exist]').trigger('submit');

        expect(wrapper.emitted().cancel.length).toBe(1);
        expect(wrapper.emitted().cancel[0]).toEqual([]);
      });
    });
  });

  describe('validation', () => {
    describe('code input', () => {
      it('should not show error by default', () => {
        expect(
          wrapper.find('[data-test=code-input]').attributes().error,
        ).toBeUndefined();
      });

      it('should not show error with valid data', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=code-input]').vm.$emit('input', code);
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=code-input]').attributes().error,
        ).toBeUndefined();
      });

      it('should show error with invalid code', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=code-input]').vm.$emit('input', 'short');
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=code-input]').attributes().error,
        ).toMatch('6 digits');
      });

      it('should show error with empty code', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=code-input]').vm.$emit('input', 'short');
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

      it('should enable submit with valid code', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=code-input]').vm.$emit('input', code);
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=submit-button]').attributes().disabled,
        ).toBeUndefined();
      });

      it('should disable submit with invalid code', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=code-input]').vm.$emit('input', code);
        await global.flushPromises();

        wrapper.find('[data-test=code-input]').vm.$emit('input', 'short');
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=submit-button]').attributes().disabled,
        ).toBe('true');
      });
    });
  });
});
