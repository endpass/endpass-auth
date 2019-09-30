import { shallowMount } from '@vue/test-utils';
import { address } from '@unitFixtures/accounts';
import VAddress from '@/components/common/VAddress';

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
