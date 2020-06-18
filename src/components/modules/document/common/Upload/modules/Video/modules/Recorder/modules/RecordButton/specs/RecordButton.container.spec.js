import VeeValidate from 'vee-validate';
import UIComponents from '@endpass/ui';

import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueCompositionApi from '@vue/composition-api';
import setupI18n from '@/locales/i18nSetup';
import RecordButtonContainer from '../RecordButton.container';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);
localVue.use(VeeValidate);
localVue.use(UIComponents);
localVue.use(VueCompositionApi);

describe('RecordButtonContainer', () => {
  let wrapper;

  const defaultProps = {
    isRecording: false,
    isPlaying: false,
    isPlayAvailable: false,
    secondsLeft: 0,
    secondsTotal: 5,
  };

  const createWrapper = options => {
    return shallowMount(RecordButtonContainer, {
      propsData: {
        ...defaultProps,
      },
      localVue,
      i18n,
      sync: false,
      ...options,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should match snapshot', () => {
      expect.assertions(1);

      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render record button', () => {
      expect.assertions(1);

      wrapper = createWrapper();

      expect(wrapper.find('mediarecordview-stub').exists()).toBe(true);
    });

    it('should render timer', () => {
      expect.assertions(1);

      wrapper = createWrapper({
        propsData: {
          ...defaultProps,
          isRecording: true,
        },
      });

      expect(wrapper.find('mediatimerview-stub').exists()).toBe(true);
    });

    it('should render play', () => {
      expect.assertions(1);

      wrapper = createWrapper({
        propsData: {
          ...defaultProps,
          isPlayAvailable: true,
        },
      });

      expect(wrapper.find('mediaplayview-stub').exists()).toBe(true);
    });

    it('should render pause', () => {
      expect.assertions(1);

      wrapper = createWrapper({
        propsData: {
          ...defaultProps,
          isPlayAvailable: true,
          isPlaying: true,
        },
      });

      expect(wrapper.find('mediapauseview-stub').exists()).toBe(true);
    });
  });

  describe('behavior', () => {
    it('should emit record', () => {
      expect.assertions(2);

      expect(wrapper.emitted().record).toBeUndefined();

      wrapper.find('mediarecordview-stub').vm.$emit('record');

      expect(wrapper.emitted().record).toEqual([[]]);
    });

    it('should emit play', () => {
      expect.assertions(2);

      wrapper = createWrapper({
        propsData: {
          ...defaultProps,
          isPlayAvailable: true,
        },
      });

      expect(wrapper.emitted().play).toBeUndefined();

      wrapper.find('mediaplayview-stub').vm.$emit('play');

      expect(wrapper.emitted().play).toEqual([[]]);
    });

    it('should emit pause', () => {
      expect.assertions(2);

      wrapper = createWrapper({
        propsData: {
          ...defaultProps,
          isPlayAvailable: true,
          isPlaying: true,
        },
      });

      expect(wrapper.emitted().pause).toBeUndefined();

      wrapper.find('mediapauseview-stub').vm.$emit('pause');

      expect(wrapper.emitted().pause).toEqual([[]]);
    });
  });
});
