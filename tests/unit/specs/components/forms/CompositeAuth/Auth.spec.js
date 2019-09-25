import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import Auth from '@/components/forms/Auth.vue';
import { IDENTITY_MODE } from '@/constants';
import setupI18n from '@/locales/i18nSetup';

describe('Auth', () => {
  let wrapper;

  const localVue = createLocalVue();
  localVue.use(VeeValidate);
  const i18n = setupI18n(localVue);

  beforeEach(() => {
    wrapper = shallowMount(Auth, {
      localVue,
      propsData: {
        isInited: true,
      },
      provide: {
        theme: 'default',
      },
      i18n,
    });
  });

  describe('render', () => {
    it('should correctly render Auth component', () => {
      expect(wrapper.name()).toBe('AuthForm');
      expect(wrapper.find('[data-test=email-input]').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render error', () => {
      wrapper = shallowMount(Auth, {
        localVue,
        propsData: {
          message: 'foo',
          error: 'bar',
        },
        provide: {
          theme: 'default',
        },
        i18n,
      });

      expect(wrapper.findAll('[data-test=error-message]').exists()).toBe(true);
    });

    it('should change submit button text if loading and make it disabled', () => {
      wrapper = shallowMount(Auth, {
        localVue,
        propsData: {
          message: 'foo',
          loading: true,
        },
        provide: {
          theme: 'default',
        },
        i18n,
      });

      const submitButton = wrapper.find('[data-test=submit-button-auth]');

      expect(wrapper.html()).toMatchSnapshot();
      expect(submitButton.text()).toBe('Loading...');
      expect(submitButton.attributes().disabled).toBe('true');
    });

    describe('server mode', () => {
      it('should not render server mode component by default', () => {
        expect(wrapper.find('server-mode-select-stub').exists()).toBe(false);
      });

      it('should render server mode component', () => {
        wrapper.setProps({
          isServerMode: true,
        });

        expect(wrapper.find('server-mode-select-stub').exists()).toBe(true);
      });
    });
  });

  describe('behavior', () => {
    const email = 'foo+@bar.baz';
    const defaultServerMode = {
      type: IDENTITY_MODE.DEFAULT,
      serverUrl: undefined,
    };
    const defaultEmitParams = { email, serverMode: defaultServerMode };

    describe('form', () => {
      beforeEach(() => {
        wrapper = mount(Auth, {
          localVue,
          propsData: {
            message: 'foo',
            isInited: true,
          },
          provide: {
            theme: 'default',
          },
          i18n,
        });
      });

      describe('email', () => {
        describe('empty', () => {
          it('should not allow submit form', () => {
            wrapper.find('form').trigger('submit');

            expect(wrapper.emitted().submit).toBe(undefined);
          });
        });

        describe('invalid', () => {
          it('should disable submit button', () => {
            ['foo@bar', 'foo foo@bar.com', 'foo@bar.com foo'].forEach(
              badEmail => {
                wrapper.setData({
                  email: badEmail,
                });

                expect(
                  wrapper.find('[data-test=submit-button-auth]').attributes()
                    .disabled,
                ).toBe('disabled');
              },
            );
          });

          it('should not allow submit form', () => {
            wrapper.setData({
              email: 'foo@bar',
            });

            wrapper.find('form').trigger('submit');

            expect(wrapper.emitted().submit).toBe(undefined);
          });
        });

        describe('valid', () => {
          beforeEach(() => {
            wrapper.setData({
              email,
            });
          });

          it('should enable submit button', () => {
            expect(
              wrapper.find('[data-test=submit-button-auth]').attributes()
                .disabled,
            ).not.toBe('disabled');
          });

          it('should allow submit', () => {
            wrapper.find('form').trigger('submit');

            expect(wrapper.emitted().submit).toEqual([[defaultEmitParams]]);
          });
        });
      });

      describe('terms', () => {
        beforeEach(() => {
          wrapper.setData({
            email,
          });
        });

        describe('isn`t accepted', () => {
          beforeEach(() => {
            wrapper.setData({
              isTermsAccepted: false,
            });
          });

          it('should not allow submit form', () => {
            wrapper.find('form').trigger('submit');

            expect(wrapper.emitted().submit).toBe(undefined);
          });

          it('should disable submit button', () => {
            expect(
              wrapper.find('[data-test=submit-button-auth]').attributes()
                .disabled,
            ).toBe('disabled');
          });
        });

        describe('is accepted', () => {
          beforeEach(() => {
            wrapper.setData({
              isTermsAccepted: true,
            });
          });

          it('should allow submit form', () => {
            wrapper.find('form').trigger('submit');

            expect(wrapper.emitted().submit).toEqual([[defaultEmitParams]]);
          });

          it('should enable submit button', () => {
            expect(
              wrapper.find('[data-test=submit-button-auth]').attributes()
                .disabled,
            ).not.toBe('disabled');
          });
        });
      });
    });

    describe('server mode', () => {
      beforeEach(() => {
        wrapper.setProps({
          isServerMode: true,
        });
      });

      describe('emit', () => {
        it('should not render email form when custom event', () => {
          const customServerMode = {
            type: IDENTITY_MODE.CUSTOM,
            serverUrl: 'https://site.com',
          };

          wrapper
            .find('server-mode-select-stub')
            .vm.$emit('input', customServerMode);

          expect(wrapper.find('[data-test=email-input]').exists()).toBe(false);
        });

        it('should not render email form when local event', () => {
          const localServerMode = {
            type: IDENTITY_MODE.LOCAL,
            serverUrl: undefined,
          };

          wrapper
            .find('server-mode-select-stub')
            .vm.$emit('input', localServerMode);

          expect(wrapper.find('[data-test=email-input]').exists()).toBe(false);
        });

        it('should emit submit event when confirm', () => {
          wrapper.setData({
            email,
          });

          wrapper.find('server-mode-select-stub').vm.$emit('confirm');

          expect(wrapper.emitted().submit).toEqual([[defaultEmitParams]]);
        });
      });
    });
  });
});
