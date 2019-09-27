import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import ServerModeSelect from '@/components/common/ServerModeSelect';
import { IDENTITY_MODE } from '@/constants';
import setupI18n from '@/locales/i18nSetup';
import modeService from '@/service/mode';
import createStore from '@/store/createStore';
import createStores from '@/store/createStores';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VeeValidate);
const i18n = setupI18n(localVue);

describe('ServerModeSelect', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    const store = createStore();
    const { accountsStore, coreStore } = createStores(store);

    wrapper = shallowMount(ServerModeSelect, {
      accountsStore,
      coreStore,
      localVue,
      i18n,
    });
  });

  describe('render', () => {
    it('should correctly render ServerModeSelect component', () => {
      expect(wrapper.name()).toBe('ServerModeSelect');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render default mode', () => {
      expect(wrapper.vm.currentIdentityServerType).toBe(IDENTITY_MODE.DEFAULT);
      expect(wrapper.find('[data-test=custom-server-input]').exists()).toBe(
        false,
      );
      expect(
        wrapper.find('[data-test=custom-error-validation-message]').exists(),
      ).toBe(false);
      expect(wrapper.find('[data-test=submit-button]').exists()).toBe(false);
    });
  });

  describe('behavior', () => {
    describe('select', () => {
      describe('local mode', () => {
        beforeEach(() => {
          wrapper
            .find('[data-test=mode-select]')
            .vm.$emit('input', IDENTITY_MODE.LOCAL);
        });

        it('should show submit button', () => {
          expect(wrapper.find('[data-test=submit-button]').exists()).toBe(true);
        });

        it('should enable submit button', () => {
          expect(
            wrapper.find('[data-test=submit-button]').attributes().disabled,
          ).toBe(undefined);
        });

        it('should emit input with correct params', () => {
          const params = {
            serverUrl: undefined,
            type: IDENTITY_MODE.LOCAL,
          };

          wrapper.find('[data-test=submit-button]').vm.$emit('click');
          expect([...wrapper.emitted().input].pop()).toEqual([params]);
        });

        it('should emit confirm', () => {
          wrapper.find('[data-test=submit-button]').vm.$emit('click');
          expect(wrapper.emitted().confirm).toHaveLength(1);
        });
      });

      describe('custom mode', () => {
        const serverUrl = 'https://site.com';

        beforeEach(() => {
          wrapper
            .find('[data-test=mode-select]')
            .vm.$emit('input', IDENTITY_MODE.CUSTOM);
        });

        it('should show submit button', () => {
          expect(wrapper.find('[data-test=submit-button]').exists()).toBe(true);
        });

        describe('url validation', () => {
          it('should disable submit button by default', () => {
            expect(
              wrapper.find('[data-test=submit-button]').attributes().disabled,
            ).toBe('true');
          });

          it('should disable button with invalid url', () => {
            wrapper
              .find('[data-test=custom-server-input]')
              .vm.$emit('input', 'badUrl');

            expect(
              wrapper.find('[data-test=submit-button]').attributes().disabled,
            ).toBe('true');
          });

          it('should enable button with valid url', () => {
            // TODO for magic
            expect(wrapper.vm.isFormValid).toBe(false);

            wrapper
              .find('[data-test=custom-server-input]')
              .vm.$emit('input', serverUrl);

            // TODO magic not work with nextTick too
            // expect(
            //   wrapper.find('[data-test=submit-button]').attributes().disabled,
            // ).toBe(undefined);
            expect(wrapper.vm.isFormValid).toBe(true);
          });
        });

        describe('valid url', () => {
          const params = {
            serverUrl,
            type: IDENTITY_MODE.CUSTOM,
          };

          beforeEach(() => {
            modeService.validateIdentityServer.mockResolvedValueOnce(true);

            wrapper
              .find('[data-test=custom-server-input]')
              .vm.$emit('input', serverUrl);
          });

          it('should emit input with correct params', () => {
            wrapper.find('[data-test=submit-button]').vm.$emit('click');
            expect([...wrapper.emitted().input].pop()).toEqual([params]);
          });

          it('should emit confirm', async () => {
            wrapper.find('[data-test=submit-button]').vm.$emit('click');

            await global.flushPromises();

            expect(wrapper.emitted().confirm).toHaveLength(1);
          });
        });

        describe('invalid url', () => {
          const error = new Error('error');

          beforeEach(() => {
            modeService.validateIdentityServer.mockRejectedValueOnce(error);

            wrapper
              .find('[data-test=custom-server-input]')
              .vm.$emit('input', serverUrl);
          });

          it('should not emit confirm', async () => {
            wrapper.find('[data-test=submit-button]').vm.$emit('click');

            await global.flushPromises();

            expect(wrapper.emitted().confirm).toBe(undefined);
          });

          it('should show error', async () => {
            wrapper.find('[data-test=submit-button]').vm.$emit('click');

            await global.flushPromises();

            const Message = wrapper.find(
              '[data-test=error-validation-message]',
            );

            expect(Message.exists()).toBe(true);
            expect(Message.text()).toBe(error.message);
          });
        });
      });
    });
  });
});
