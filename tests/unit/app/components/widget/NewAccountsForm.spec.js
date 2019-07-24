import Vuex from 'vuex';
import validation from '@/validation';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import NewAccountForm from '@/components/widget/NewAccountForm.vue';
import setupI18n from '@/locales/i18nSetup';
import { address } from '@unitFixtures/accounts';
import VeeValidate from 'vee-validate';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VeeValidate);
localVue.use(validation);
const i18n = setupI18n(localVue);

jest.useFakeTimers();

describe('NewAccountForm', () => {
  let wrapper;
  let store;
  let storeData;
  let widgetModule;

  beforeEach(() => {
    jest.clearAllMocks();
    widgetModule = {
      actions: {
        createWalletFromWidget: jest.fn(),
      },
    };
    storeData = {
      modules: {
        widget: widgetModule,
      },
    };

    store = new Vuex.Store(storeData);
    wrapper = shallowMount(NewAccountForm, {
      localVue,
      store,
      i18n,
      sync: false,
      provide: {
        theme: 'default',
      },
    });
  });

  describe('render', () => {
    it('should correctly render NewAccountForm component', () => {
      expect(wrapper.name()).toBe('WidgetNewAccountForm');
      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.find('[data-test=new-account-submit-button]').text()).toBe(
        i18n.t('components.widgetNewAccount.createAccount'),
      );
    });

    it('should change submit button label on loading', async () => {
      expect.assertions(1);

      wrapper.setProps({
        isLoading: true,
      });

      await wrapper.vm.$nextTick();

      expect(wrapper.find('[data-test=new-account-submit-button]').text()).toBe(
        i18n.t('components.widgetNewAccount.creatingAccount'),
      );
    });
  });

  describe('behavior', () => {
    it('should emit cancel event on cancel button click', () => {
      wrapper.find('[data-test=new-account-cancel-button]').vm.$emit('click');

      expect(wrapper.emitted().cancel).not.toBeFalsy();
    });

    it('should submit password and current account on form submit', async () => {
      expect.assertions(1);

      const password = '12341234';

      wrapper.setProps({
        currentAccount: address,
      });
      wrapper
        .find('[data-test=new-account-password-input]')
        .vm.$emit('input', password);

      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.find('form').trigger('submit');

      await global.flushPromises();

      expect(widgetModule.actions.createWalletFromWidget).toBeCalledWith(
        expect.any(Object),
        {
          password,
          address,
        },
        undefined,
      );
    });

    it('should set error if submit failed', async () => {
      const error = new Error('foo');

      widgetModule.actions.createWalletFromWidget.mockRejectedValueOnce(error);

      const password = '12341234';

      wrapper.setProps({
        currentAccount: address,
      });
      wrapper
        .find('[data-test=new-account-password-input]')
        .vm.$emit('input', password);

      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.find('form').trigger('submit');

      await global.flushPromises();

      expect(
        wrapper.find('[data-test=new-account-password-input]').attributes()
          .error,
      ).toBe(error.message);
    });
  });
});
