import VeeValidate from 'vee-validate';
import UIComponents from '@endpass/ui';

import { shallowMount, createLocalVue } from '@vue/test-utils';
import setupI18n from '@/locales/i18nSetup';
import DocumentUpload from '@/components/screens/DocumentCreate/DocumentUpload';
import documentsService from '@/service/documents';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);
localVue.use(VeeValidate);
localVue.use(UIComponents);

describe('DocumentUpload', () => {
  let wrapper;

  const createWrapper = () => {
    return shallowMount(DocumentUpload, {
      localVue,
      i18n,
      sync: false,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = createWrapper();
  });

  it('should match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should create new instance of uploadController for new component', () => {
    const wrapperSecond = createWrapper();
    const { uploadController: checkController } = wrapperSecond.vm.$options;

    expect(checkController).not.toBe(null);
    expect(checkController).not.toBe(undefined);
    expect(checkController).not.toBe(wrapper.vm.$options.uploadController);
  });

  it('should show error, if confirm is not passed', async () => {
    expect.assertions(3);

    documentsService.confirmDocument.mockRejectedValueOnce(new Error());

    const file = new File(['foo'], 'foo.jpg', {
      type: 'image/jpeg',
    });
    wrapper.setData({
      selectedFile: file,
    });

    await global.flushPromises();

    wrapper.find('[data-test=submit-button]').vm.$emit('click');

    await global.flushPromises();

    wrapper.find('[data-test=done-button]').vm.$emit('click');

    await global.flushPromises();

    expect(
      wrapper.find('[data-test=repeat-recognize-button]').attributes().disabled,
    ).toBeFalsy();
    expect(
      wrapper.find('[data-test=cancel-button]').attributes().disabled,
    ).toBeFalsy();

    expect(wrapper.find('document-upload-form-stub').attributes().error).toBe(
      'Something went wrong while document recognition. Please try again.',
    );
  });
});
