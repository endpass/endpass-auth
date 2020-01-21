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

  const createWrapper = () => {
    return shallowMount(UploadError, {
      localVue,
      i18n,
      sync: false,
      propsData: {
        file,
        error,
      },
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
  });
});
