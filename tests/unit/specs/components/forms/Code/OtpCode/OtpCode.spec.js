import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Otp from '@/components/forms/Code/OtpCode/OtpCode';
import setupI18n from '@/locales/i18nSetup';
import identityService from '@/service/identity';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);
const i18n = setupI18n(localVue);

describe('OtpCode', () => {
  let wrapper;
  const router = new VueRouter();

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(Otp, {
      localVue,
      i18n,
      router,
    });
  });

  describe('render', () => {
    it('should correctly render Otp component', () => {
      expect(wrapper.name()).toBe('OtpCode');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render opt form', () => {
      expect(wrapper.find('otp-form-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render recover form', async () => {
      expect.assertions(2);

      wrapper.find('otp-form-stub').vm.$emit('recover');

      await global.flushPromises();

      expect(wrapper.find('recover-form-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    describe('otp form', () => {
      describe('recover event', () => {
        it('should handle recover event', async () => {
          expect.assertions(1);

          const identifier = 'identifier';

          identityService.getRecoveryIdentifier.mockResolvedValueOnce(
            identifier,
          );

          wrapper.find('otp-form-stub').vm.$emit('recover');

          await global.flushPromises();

          expect(wrapper.find('recover-form-stub').exists()).toBe(true);
        });

        it('should recover otp', async () => {
          expect.assertions(1);

          wrapper.find('otp-form-stub').vm.$emit('recover');
          await wrapper.vm.$nextTick();

          wrapper.find('recover-form-stub').vm.$emit('submit');
          await wrapper.vm.$nextTick();

          expect(wrapper.find('message-form-stub').exists()).toBe(true);
        });
      });
    });
  });
});
