import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueCompositionApi from '@vue/composition-api';
import setupI18n from '@/locales/i18nSetup';
import RecorderView from '../Recorder.view';
import VideoStream from '../modules/VideoStream';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);
localVue.use(VueCompositionApi);

describe('RecorderView', () => {
  let wrapper;

  const wrapperFactory = (options = {}) => {
    return shallowMount(RecorderView, {
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
      expect(wrapper.name()).toEqual('RecorderView');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should emit confirm with file', () => {
      expect.assertions(2);

      const recordedFile = 'recordedFile';

      expect(wrapper.emitted().confirm).toBeUndefined();

      wrapper.find('video-stream-stub').vm.$emit('update:file', recordedFile);
      wrapper.find('recorder-controls-stub').vm.$emit('confirm');

      expect(wrapper.emitted().confirm).toEqual([[recordedFile]]);
    });

    it('should emit cancel', () => {
      expect.assertions(2);

      expect(wrapper.emitted().cancel).toBeUndefined();

      wrapper.find('[data-test=back-button]').trigger('click');

      expect(wrapper.emitted().cancel).toEqual([[]]);
    });

    it('should show error message if recorder failed', async () => {
      expect.assertions(3);

      expect(wrapper.find('[data-test=recorder-view-error]').exists()).toBe(
        false,
      );

      wrapper.find(VideoStream).vm.$emit('error', 'lorem ipsum');

      await wrapper.vm.$nextTick();

      expect(wrapper.find('[data-test=recorder-view-error]').exists()).toBe(
        true,
      );
      expect(wrapper.find('[data-test=recorder-view-error]').text()).toMatch(
        'lorem ipsum',
      );
    });
  });
});
