import { shallowMount, createLocalVue } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import Otp from '@/components/forms/Otp';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();

localVue.use(VeeValidate);
const i18n = setupI18n(localVue);

describe('Otp', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Otp, {
      localVue,
      provide: {
        theme: 'default',
      },
      i18n,
    });
  });

  describe('render', () => {
    it('should correctly render Otp component', () => {
      expect(wrapper.name()).toBe('OtpForm');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should correctly disable recovery link', () => {
      const recoveryLink = wrapper.find('[data-test=recovery-link]');

      wrapper.setProps({
        loading: false,
      });

      expect(recoveryLink.attributes().disabled).toBeUndefined();

      wrapper.setProps({
        loading: true,
      });

      expect(recoveryLink.attributes().disabled).toBeTruthy();
    });
  });

  describe('behavior', () => {
    it('should not emit recover event', () => {
      wrapper.setProps({
        loading: true,
      });

      wrapper.find('[data-test=recovery-link]').trigger('click');
      expect(wrapper.emitted().recover).toBe(undefined);
    });

    it('should emit recover event', () => {
      wrapper.setProps({
        loading: false,
      });

      wrapper.find('[data-test=recovery-link]').trigger('click');
      expect(wrapper.emitted().recover).toEqual([[]]);
    });
  });
});
