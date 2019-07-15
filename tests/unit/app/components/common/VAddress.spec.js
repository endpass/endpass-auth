import { shallowMount } from '@vue/test-utils';
import VAddress from '@/components/common/VAddress.vue';
import { address } from '@unitFixtures/accounts';

describe('VAddress', () => {
  describe('render', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallowMount(VAddress, {
        propsData: {
          address,
        },
      });
    });

    it('should correctly render VAddress component', () => {
      expect(wrapper.name()).toBe('VAddress');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
