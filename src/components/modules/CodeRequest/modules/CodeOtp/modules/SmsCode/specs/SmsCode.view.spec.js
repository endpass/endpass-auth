import { shallowMount, createLocalVue } from '@vue/test-utils';
import { code } from '@unitFixtures/auth';
import VeeValidate from 'vee-validate';
import SmsCodeView from '@/components/modules/CodeRequest/modules/CodeOtp/modules/SmsCode/SmsCode.view';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(VeeValidate);

describe('SmsCodeView', () => {
  let wrapper;
  const createWrapper = (options, props) =>
    shallowMount(SmsCodeView, {
      provide: {
        theme: 'default',
      },
      localVue,
      propsData: {
        isLoading: false,
        error: '',
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
      expect(wrapper.name()).toBe('SmsCodeView');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render form', () => {
      expect(wrapper.find('[data-test=sms-code-form]').exists()).toBe(true);
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
        ).toBeFalsy();
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
    it('should emit submit event', async () => {
      expect.assertions(4);

      expect(wrapper.emitted().submit).toBeUndefined();

      wrapper.find('[data-test=code-input]').vm.$emit('input', code);
      await global.flushPromises();

      expect(
        wrapper.find('[data-test=submit-button]').attributes().disabled,
      ).toBeUndefined();

      wrapper.find('[data-test=sms-code-form]').trigger('submit');

      expect(wrapper.emitted().submit.length).toBe(1);
      expect(wrapper.emitted().submit[0]).toEqual([
        { code, isRemember: false },
      ]);
    });

    it('should emit submit event with remember', async () => {
      expect.assertions(4);

      expect(wrapper.emitted().submit).toBeUndefined();

      wrapper.find('[data-test=code-input]').vm.$emit('input', code);
      wrapper.find('[data-test=remember-me-checkbox]').vm.$emit('input', true);
      await global.flushPromises();

      expect(
        wrapper.find('[data-test=submit-button]').attributes().disabled,
      ).toBeUndefined();

      wrapper.find('[data-test=sms-code-form]').trigger('submit');

      expect(wrapper.emitted().submit.length).toBe(1);
      expect(wrapper.emitted().submit[0]).toEqual([{ code, isRemember: true }]);
    });

    it('should emit send code event', () => {
      expect(wrapper.emitted()['send-code']).toBeUndefined();

      wrapper.find('send-code-stub').vm.$emit('send-code');

      expect(wrapper.emitted()['send-code'].length).toBe(1);
      expect(wrapper.emitted()['send-code'][0]).toEqual([]);
    });
  });

  describe('validation', () => {
    describe('code input', () => {
      it('should not show error by default', () => {
        expect(
          wrapper.find('[data-test=code-input]').attributes().error,
        ).toBeFalsy();
      });

      it('should not show error with valid data', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=code-input]').vm.$emit('input', code);
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=code-input]').attributes().error,
        ).toBeFalsy();
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
