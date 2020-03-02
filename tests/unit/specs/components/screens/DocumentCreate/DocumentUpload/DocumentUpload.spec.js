import VeeValidate from 'vee-validate';
import UIComponents from '@endpass/ui';

import { shallowMount, createLocalVue } from '@vue/test-utils';
import setupI18n from '@/locales/i18nSetup';
import DocumentUpload from '@/components/screens/DocumentCreate/Upload';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';
import { DOC_TYPES } from '@/constants';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);
localVue.use(VeeValidate);
localVue.use(UIComponents);

describe('DocumentUpload', () => {
  let wrapper;

  const getDocType = root =>
    root.find('[data-test=document-type]').attributes().value;

  const createStores = () => {
    const store = createStore();
    const { sharedStore } = createStoreModules(store);

    return { sharedStore };
  };

  const createWrapper = (stores = createStores()) => {
    return shallowMount(DocumentUpload, {
      ...stores,
      localVue,
      i18n,
      sync: false,
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

    expect(getDocType(wrapper)).toBe(DOC_TYPES.PASSPORT);
  });

  it('should show document type as driver license', () => {
    const { sharedStore } = createStores();

    sharedStore.setDocumentUploadOptions({
      defaultDocumentType: DOC_TYPES.DRIVER_LICENSE,
    });

    wrapper = createWrapper({ sharedStore });

    expect(getDocType(wrapper)).toBe(DOC_TYPES.DRIVER_LICENSE);
  });
});
