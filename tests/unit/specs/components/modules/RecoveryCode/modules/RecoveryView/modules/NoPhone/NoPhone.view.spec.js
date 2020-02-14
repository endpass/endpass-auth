import { shallowMount, createLocalVue } from '@vue/test-utils';
import VeeValidate from 'vee-validate';
import NoPhoneView from '@/components/modules/RecoveryCode/modules/RecoveryView/modules/NoPhone/NoPhone.view';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(VeeValidate);

describe('NoPhoneView', () => {
  let wrapper;
  const createWrapper = props =>
    shallowMount(NoPhoneView, {
      provide: {
        theme: 'default',
      },
      localVue,
      propsData: {
        isLoading: false,
        ...props,
      },
      sync: false,
      i18n,
    });

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('NoPhone');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render form', () => {
      expect(wrapper.find('[data-test=phone-not-exist]').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    describe('phone is not exist', () => {
      beforeEach(() => {
        wrapper = createWrapper();
      });

      it('should show message', () => {
        expect(wrapper.find('[data-test=phone-not-exist]').exists()).toBe(true);
      });

      it('should emit cancel event', () => {
        expect.assertions(4);

        expect(wrapper.emitted().cancel).toBeUndefined();

        expect(
          wrapper.find('[data-test=submit-button]').attributes().disabled,
        ).toBeUndefined();

        wrapper.find('[data-test=phone-not-exist]').trigger('submit');

        expect(wrapper.emitted().cancel.length).toBe(1);
        expect(wrapper.emitted().cancel[0]).toEqual([]);
      });

      it('should set loading state', () => {
        expect.assertions(1);

        wrapper = createWrapper({
          isLoading: true,
        });

        expect(
          wrapper.find('[data-test=submit-button]').attributes().isloading,
        ).toBeTruthy();
      });
    });
  });
});
