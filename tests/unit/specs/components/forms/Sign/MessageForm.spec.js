import VeeValidate from 'vee-validate';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { requestWithMessage } from '@unitFixtures/requests';
import validation from '@/validation';
import MessageForm from '@/components/forms/Sign/MessageForm.vue';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(VeeValidate);
localVue.use(validation);

describe('Sign > MessageForm', () => {
  let wrapperFactory;
  let wrapper;

  beforeEach(() => {
    wrapperFactory = (props = {}) =>
      shallowMount(MessageForm, {
        localVue,
        i18n,
        sync: false,
        propsData: props,
        provide: {
          theme: 'default',
        },
      });
    wrapper = wrapperFactory({
      request: requestWithMessage,
    });
  });

  describe('render', () => {
    it('should render component and has correct name', () => {
      expect(wrapper.name()).toEqual('SignMessageForm');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should render given request's message", () => {
      expect(wrapper.find('[data-test=sign-form-message]').exists()).toBe(true);
    });
  });

  describe('behavior', () => {
    it('should handle base form submit and bubble it', () => {
      const payload = {
        account: '0x123',
        password: '123',
      };

      wrapper.find('base-form-stub').vm.$emit('submit', payload);

      expect(wrapper.emitted().submit).toEqual([[payload]]);
    });
  });
});
