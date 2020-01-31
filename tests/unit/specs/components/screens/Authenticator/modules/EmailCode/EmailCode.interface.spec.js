import { shallowMount, createLocalVue } from '@vue/test-utils';
import EmailCodeInterface from '@/components/screens/Authenticator/modules/EmailCode/EmailCode.interface';
import EmailCodeInteractor from '@/components/screens/Authenticator/modules/EmailCode/EmailCode.interactor';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('EmailCodeInterface', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(EmailCodeInterface, {
      localVue,
      i18n,
      propsData: {
        password: '',
        email: '',
      },
    });
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('EmailCodeInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render email form', () => {
      expect(wrapper.find('email-code-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit event', () => {
      // const RootElement = createWrapper(wrapper.vm.$children[0]);
      // RootElement.vm.$emit('auth');

      expect(wrapper.emitted().complete).toBeUndefined();

      wrapper.find(EmailCodeInteractor).vm.$emit('auth');

      expect(wrapper.emitted().complete.length).toBe(1);
      expect(wrapper.emitted().complete[0]).toEqual([]);
    });
  });
});
