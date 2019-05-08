import { shallowMount } from '@vue/test-utils';
import Otp from '@/components/forms/CompositeAuth/Otp.vue';

describe('Otp', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Otp);
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
