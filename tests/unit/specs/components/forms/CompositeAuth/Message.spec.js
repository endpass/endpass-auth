import { shallowMount, createLocalVue, mount } from '@vue/test-utils';
import Message from '@/components/forms/CompositeAuth/Message';

import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('Message', () => {
  describe('render', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallowMount(Message, {
        localVue,
        i18n,
        propsData: {
          message: 'foo',
        },
      });
    });

    it('should correctly render Message component', () => {
      expect(wrapper.name()).toBe('MessageForm');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(Message, {
        localVue,
        i18n,
        propsData: {
          message: 'foo',
        },
      });
    });

    describe('cancel feature', () => {
      it('should emit close on click cancel button by default', () => {
        wrapper.find('[data-test=cancel-button]').vm.$emit('click');

        expect(wrapper.emitted().cancel).toBeTruthy();
      });
    });
  });
});
