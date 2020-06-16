import VeeValidate from 'vee-validate';
import UIComponents from '@endpass/ui';

import { shallowMount, createLocalVue } from '@vue/test-utils';
import setupI18n from '@/locales/i18nSetup';
import UploadContainer from '../Upload.container';
import { DOC_TYPES } from '@/constants';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);
localVue.use(VeeValidate);
localVue.use(UIComponents);

describe('UploadContainer', () => {
  let wrapper;

  const createWrapper = options => {
    return shallowMount(UploadContainer, {
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
    expect.assertions(1);

    wrapper = createWrapper();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render front side only', () => {
    expect.assertions(1);

    wrapper = createWrapper();

    expect(wrapper.find('frontsideonly-stub').attributes().documenttype).toBe(
      DOC_TYPES.PASSPORT,
    );
  });

  it('should render back and front', () => {
    expect.assertions(1);

    wrapper = createWrapper({
      propsData: {
        selectedDocumentType: DOC_TYPES.ID_CARD,
      },
    });

    expect(wrapper.find('backandfront-stub').attributes().documenttype).toBe(
      DOC_TYPES.ID_CARD,
    );
  });

  it('should render selfie', () => {
    expect.assertions(1);

    wrapper = createWrapper({
      propsData: {
        selectedDocumentType: DOC_TYPES.SELFIE,
      },
    });

    expect(wrapper.find('videocontainer-stub').attributes().documenttype).toBe(
      DOC_TYPES.SELFIE,
    );
  });
});
