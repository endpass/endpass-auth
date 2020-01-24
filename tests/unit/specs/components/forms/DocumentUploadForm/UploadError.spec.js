import { shallowMount, createLocalVue } from '@vue/test-utils';
import setupI18n from '@/locales/i18nSetup';

import UploadError from '@/components/forms/DocumentUploadForm/UploadError';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('DocumentUploadForm > UploadError', () => {
  let wrapper;

  const fileName = 'alongfilename';
  const file = new File([''], fileName);
  const error = 'File Error example';

  const createWrapper = options => {
    return shallowMount(UploadError, {
      localVue,
      i18n,
      sync: false,
      propsData: {
        file,
        error,
      },
      ...options,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render Upload Error component', () => {
      expect(wrapper.name()).toBe('UploadError');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should correctly render file name', () => {
      expect(wrapper.find('file-name-stub').attributes().name).toBe(fileName);
    });

    it('should correctly render error description', () => {
      expect(wrapper.find('v-description-stub').attributes().description).toBe(
        error,
      );
    });

    it('should pass is-error as true when have error', () => {
      expect(wrapper.find('upload-title-stub').attributes().iserror).toBe(
        'true',
      );
    });

    it('should drop is-error when no error', () => {
      wrapper = createWrapper({
        propsData: {
          file,
        },
      });

      expect(
        wrapper.find('upload-title-stub').attributes().iserror,
      ).toBeUndefined();
    });
  });
});
