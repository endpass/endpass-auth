import { shallowMount, createLocalVue } from '@vue/test-utils';
import setupI18n from '@/locales/i18nSetup';
import WidgetAccounts from '@/components/widget/Accounts';
import { accounts } from '@unitFixtures/accounts';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('components > widget > WidgetAccounts', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(WidgetAccounts, {
      i18n,
      localVue,
    });
  });

  describe('render', () => {
    it('should render initial component state', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render given accounts list', () => {
      wrapper.setProps({
        accounts,
      });

      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.findAll('[data-test=account-button]')).toHaveLength(2);
    });
  });

  describe('behavior', () => {
    beforeEach(() => {
      wrapper = shallowMount(WidgetAccounts, {
        propsData: {
          accounts,
        },
        i18n,
        localVue,
      });
    });

    it('should emit account change on account button click', () => {
      wrapper.find('[data-test=account-button]').vm.$emit('click');

      expect(wrapper.emitted()['account-change']).toEqual([
        [accounts[0].address],
      ]);
    });

    it('should emit logout on click logout button', () => {
      wrapper.find('[data-test=logout-button]').vm.$emit('click');

      expect(wrapper.emitted().logout).toBeTruthy();
    });
  });
});
