import { shallowMount } from '@vue/test-utils';
import Content from '@/components/widget/Content.vue';
import { accounts } from '@unitFixtures/accounts';

describe('Widget Content', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Content, {
      propsData: {
        accounts,
      },
    });
  });

  describe('render', () => {
    it('should correctly render', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit accounts toggle on accounts control click', () => {
      wrapper.find('[data-test=accounts-toggle-button]').vm.$emit('click');

      expect(wrapper.emitted()['accounts-toggle']).toBeTruthy();
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
