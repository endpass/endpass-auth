import { shallowMount, mount } from '@vue/test-utils';
import Auth from '@/components/forms/Auth.vue';
import { IDENTITY_MODE } from '@/constants';

describe('Auth', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Auth, {
      propsData: {
        inited: true,
      },
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
        propsData: {
          message: 'foo',
          error: 'bar',
        },
      });

      expect(wrapper.findAll('[data-test=error-message]').exists()).toBe(true);
    });

    it('should change submit button text if loading and make it disabled', () => {
      wrapper = shallowMount(Auth, {
        propsData: {
          message: 'foo',
          loading: true,
        },
      });

      const submitButton = wrapper.find('[data-test=submit-button]');

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
    const email = 'foo@bar.baz';
    const defaultServerMode = {
      type: IDENTITY_MODE.DEFAULT,
      serverUrl: undefined,
    };
    const defaultEmitParams = { email, serverMode: defaultServerMode };

    describe('form', () => {
      beforeEach(() => {
        wrapper = mount(Auth, {
          propsData: {
            message: 'foo',
            inited: true,
          },
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
          beforeEach(() => {
            wrapper.setData({
              email: 'foo@bar',
            });
          });

          it('should disable submit button', () => {
            expect(
              wrapper.find('[data-test=submit-button]').attributes().disabled,
            ).toBe('disabled');
          });

          it('should not allow submit form', () => {
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
              wrapper.find('[data-test=submit-button]').attributes().disabled,
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
              wrapper.find('[data-test=submit-button]').attributes().disabled,
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
              wrapper.find('[data-test=submit-button]').attributes().disabled,
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
