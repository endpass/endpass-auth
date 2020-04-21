import VeeValidate from 'vee-validate';
import UIComponents from '@endpass/ui';

import { shallowMount, createLocalVue } from '@vue/test-utils';
import setupI18n from '@/locales/i18nSetup';

import FrontSide from '@/components/modules/document/common/Upload/Sides/FrontSide';
import documentsService from '@/service/documents';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);
localVue.use(VeeValidate);
localVue.use(UIComponents);

describe('UploadDocument > FrontSide', () => {
  let wrapper;

  const docId = 'docId';
  const file = new File([''], 'filename');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  const createWrapper = () => {
    return shallowMount(FrontSide, {
      localVue,
      i18n,
      sync: false,
    });
  };

  const emitUpload = async () => {
    wrapper.find('drop-area-stub').vm.$emit('change', [file]);
    wrapper.find('footer-front-buttons-stub').vm.$emit('upload');
    await global.flushPromises();
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = createWrapper();
  });

  it('should upload front side of document', async () => {
    expect.assertions(1);

    documentsService.createDocument.mockResolvedValueOnce(docId);

    await emitUpload();

    expect(wrapper.emitted()['update:documentId']).toEqual([[docId]]);
  });

  it('should show error', async () => {
    expect.assertions(2);

    documentsService.createDocument.mockRejectedValueOnce(new Error());

    expect(
      wrapper.find('document-upload-front-stub').attributes().error,
    ).toBeUndefined();

    await emitUpload();

    expect(wrapper.find('document-upload-front-stub').attributes().error).toBe(
      i18n.t('store.error.uploadDocument.default'),
    );
  });

  it('should not update document id', async () => {
    expect.assertions(1);

    documentsService.createDocument.mockRejectedValueOnce(new Error());

    await emitUpload();

    expect(wrapper.emitted()['update:documentId']).toBeUndefined();
  });

  it('should show other error by status code', async () => {
    expect.assertions(1);

    const err = new Error();
    err.response = { status: 422 };
    documentsService.checkFile.mockRejectedValueOnce(err);

    await emitUpload();

    expect(wrapper.find('document-upload-front-stub').attributes().error).toBe(
      i18n.t('store.error.uploadDocument.invalidFile'),
    );
  });
});
