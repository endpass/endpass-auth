import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import SignIn from '@/components/forms/CompositeAuth/Auth/SignIn';
import { IDENTITY_MODE } from '@/constants';
import setupI18n from '@/locales/i18nSetup';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';
import identityService from '@/service/identity';

describe('SignIn', () => {
  let wrapper;
  let coreStore;

  const localVue = createLocalVue();
  localVue.use(VeeValidate);
  const i18n = setupI18n(localVue);

  const createWrapper = (options = {}) => {
    const store = createStore();
    const { coreStore: coreStoreModule } = createStoreModules(store);

    coreStore = coreStoreModule;

    return shallowMount(SignIn, {
      localVue,
      coreStore,
      propsData: {
        isPublic: false,
      },
      provide: {
        theme: 'default',
      },
      i18n,
      sync: false,
      ...options,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render SignIn component', () => {
      expect(wrapper.name()).toBe('SignInForm');
      expect(wrapper.find('[data-test=email-input]').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });

    it.skip('should render error', () => {
      // TODO: add check for show error for identity request in other tests
      wrapper = createWrapper({
        propsData: {
          message: 'foo',
          error: 'bar',
        },
      });

      expect(wrapper.findAll('[data-test=error-message]').exists()).toBe(true);
    });

    it.skip('should change submit button text if loading and make it disabled', () => {
      wrapper = createWrapper();
      wrapper.setData({
        isLoading: true,
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

      it('should render server mode component', async () => {
        expect.assertions(2);

        expect(wrapper.find('server-mode-select-stub').exists()).toBe(false);

        coreStore.isServerMode = true;

        await wrapper.vm.$nextTick();

        expect(wrapper.find('server-mode-select-stub').exists()).toBe(true);
      });

      it.skip('should not call auth if mode is not default', async () => {
        expect.assertions(2);

        wrapper.find('form-stub').vm.$emit('submit', {
          email: 'email',
          serverMode: { type: IDENTITY_MODE.CUSTOM },
        });

        await global.flushPromises();

        expect(identityService.auth).not.toBeCalled();

        expect(wrapper.emitted().authorize[0]).toEqual([
          { serverMode: { type: 'custom' } },
        ]);
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
        wrapper = mount(SignIn, {
          localVue,
          provide: {
            theme: 'default',
          },
          i18n,
          sync: false,
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

          it('should not allow submit form', async () => {
            expect.assertions(1);

            wrapper.setData({
              email: 'foo@bar',
            });
            wrapper.find('form').trigger('submit');

            await global.flushPromises();

            expect(wrapper.emitted().submit).toBe(undefined);
          });
        });

        describe('valid', () => {
          beforeEach(() => {
            wrapper.setData({
              email,
            });
          });

          it('should enable submit button', async () => {
            expect.assertions(1);

            await global.flushPromises();

            expect(
              wrapper.find('[data-test=submit-button-auth]').attributes()
                .disabled,
            ).not.toBe('disabled');
          });

          it.skip('should allow submit', () => {
            wrapper.find('form').trigger('submit');

            expect(wrapper.emitted().submit).toEqual([[defaultEmitParams]]);
          });
        });
      });
    });

    describe('server mode', () => {
      beforeEach(() => {
        coreStore.isServerMode = true;
      });

      describe('emit', () => {
        it('should not render email form when custom event', async () => {
          expect.assertions(1);

          const customServerMode = {
            type: IDENTITY_MODE.CUSTOM,
            serverUrl: 'https://site.com',
          };

          wrapper
            .find('server-mode-select-stub')
            .vm.$emit('input', customServerMode);

          await wrapper.vm.$nextTick();

          expect(wrapper.find('[data-test=email-input]').exists()).toBe(false);
        });

        it('should not render email form when local event', async () => {
          expect.assertions(1);

          const localServerMode = {
            type: IDENTITY_MODE.LOCAL,
            serverUrl: undefined,
          };

          wrapper
            .find('server-mode-select-stub')
            .vm.$emit('input', localServerMode);

          await wrapper.vm.$nextTick();

          expect(wrapper.find('[data-test=email-input]').exists()).toBe(false);
        });

        it('should emit submit event when confirm', async () => {
          expect.assertions(1);

          wrapper.setData({
            email,
          });
          await global.flushPromises();

          wrapper.find('server-mode-select-stub').vm.$emit('confirm');
          await wrapper.vm.$nextTick();

          expect(wrapper.emitted().submit).toEqual([[defaultEmitParams]]);
        });
      });
    });
  });
});
