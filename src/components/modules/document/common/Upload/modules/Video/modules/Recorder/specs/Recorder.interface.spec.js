import { createLocalVue, shallowMount } from '@vue/test-utils';
import PortalVue from 'portal-vue';
import setupI18n from '@/locales/i18nSetup';
import RecorderInterface from '../Recorder.interface';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);
localVue.use(PortalVue);

describe('RecorderInterface', () => {
  let wrapper;

  const wrapperFactory = (options = {}) => {
    return shallowMount(RecorderInterface, {
      sync: false,
      localVue,
      i18n,
      ...options,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = wrapperFactory();
  });

  describe('render', () => {
    it('should be a correct component', () => {
      expect(wrapper.isVueInstance()).toBe(true);
      expect(wrapper.name()).toEqual('RecorderInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit next', () => {
      expect.assertions(2);

      const recordedFile = 'recordedFile';

      expect(wrapper.emitted().next).toBeUndefined();

      wrapper.find('recorder-view-stub').vm.$emit('confirm', recordedFile);

      expect(wrapper.emitted().next).toEqual([[{ recordedFile }]]);
    });

    it('should emit cancel', () => {
      expect.assertions(2);

      expect(wrapper.emitted().cancel).toBeUndefined();

      wrapper.find('recorder-view-stub').vm.$emit('cancel');

      expect(wrapper.emitted().cancel).toEqual([[]]);
    });
  });
});
