import VeeValidate from 'vee-validate';
import UIComponents from '@endpass/ui';

import { shallowMount, createLocalVue } from '@vue/test-utils';
import setupI18n from '@/locales/i18nSetup';

import FileSelected from '@/components/forms/DocumentUploadForm/shared/FileSelected';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);
localVue.use(VeeValidate);
localVue.use(UIComponents);

describe('DocumentUploadForm > shared > FileSelected', () => {
  let wrapper;

  const file = new File([''], 'filename', { type: 'text/json', size: 10 });
  const imageFile = new File([''], 'image file name', {
    type: 'image/jpeg',
    size: 10,
  });

  const readAsDataURL = jest.fn();
  const addEventListener = jest.fn();
  const dummyFileReader = {
    addEventListener,
    readAsDataURL,
    result: 'content',
  };

  const mockReaderEvent = (eventNamePass, result) => {
    dummyFileReader.addEventListener = jest.fn((event, evtHandler) => {
      if (event === eventNamePass) {
        evtHandler({
          target: {
            result,
          },
        });
      }
    });
  };

  const createWrapper = propsData => {
    return shallowMount(FileSelected, {
      localVue,
      i18n,
      sync: false,
      propsData: {
        file,
        ...propsData,
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.FileReader = jest.fn(() => dummyFileReader);
    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render Upload Error component', () => {
      expect(wrapper.name()).toBe('FileSelected');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render title component by default', () => {
      expect(wrapper.find('fileastitle-stub').exists()).toBe(true);

      expect(wrapper.find('v-progress-circle-stub').exists()).toBe(false);
      expect(wrapper.find('fileasimage-stub').exists()).toBe(false);
    });

    it('should render loader', () => {
      wrapper = createWrapper({
        file: imageFile,
      });

      expect(wrapper.find('v-progress-circle-stub').exists()).toBe(true);

      expect(wrapper.find('fileasimage-stub').exists()).toBe(false);
      expect(wrapper.find('fileastitle-stub').exists()).toBe(false);
    });

    it('should render image if data passed', () => {
      const fileContent = 'fileContent';
      mockReaderEvent('load', fileContent);
      wrapper = createWrapper({
        file: imageFile,
      });

      expect(wrapper.find('fileasimage-stub').exists()).toBe(true);

      expect(wrapper.find('v-progress-circle-stub').exists()).toBe(false);
      expect(wrapper.find('fileastitle-stub').exists()).toBe(false);
    });

    it('should render title if data load fail', () => {
      const fileContent = 'fileContent';
      mockReaderEvent('error', fileContent);
      wrapper = createWrapper({
        file: imageFile,
      });

      expect(wrapper.find('fileastitle-stub').exists()).toBe(true);

      expect(wrapper.find('v-progress-circle-stub').exists()).toBe(false);
      expect(wrapper.find('fileasimage-stub').exists()).toBe(false);
    });
  });
});
