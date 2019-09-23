import { shallowMount } from '@vue/test-utils';
import Identicon from '@/components/common/Identicon.vue';

describe('Identicon', () => {
  describe('render', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallowMount(Identicon, {
        propsData: {
          address: '0x0000111122223333',
        },
      });
    });

    it('should correctly render Identicon', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
