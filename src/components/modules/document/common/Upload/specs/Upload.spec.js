import VeeValidate from 'vee-validate';
import UIComponents from '@endpass/ui';

import { shallowMount, createLocalVue } from '@vue/test-utils';
import setupI18n from '@/locales/i18nSetup';
import DocumentUpload from '@/components/modules/document/common/Upload';
import { DOC_TYPES } from '@/constants';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);
localVue.use(VeeValidate);
localVue.use(UIComponents);

describe('DocumentUpload', () => {
  let wrapper;

  const createWrapper = options => {
    return shallowMount(DocumentUpload, {
      propsData: {
        selectedDocumentType: DOC_TYPES.PASSPORT,
      },
      localVue,
      i18n,
      sync: false,
      ...options,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', () => {
    wrapper = createWrapper();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should define default doc type', () => {
    wrapper = createWrapper();

    expect(wrapper.find('sides-stub').attributes().documenttype).toBe(
      DOC_TYPES.PASSPORT,
    );
  });

  it('should show document type as driver license', () => {
    wrapper = createWrapper({
      propsData: {
        selectedDocumentType: DOC_TYPES.DRIVER_LICENSE,
      },
    });

    expect(wrapper.find('sides-stub').attributes().documenttype).toBe(
      DOC_TYPES.DRIVER_LICENSE,
    );
  });
});
