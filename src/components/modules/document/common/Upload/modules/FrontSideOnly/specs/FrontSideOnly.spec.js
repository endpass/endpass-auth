import VeeValidate from 'vee-validate';
import UIComponents from '@endpass/ui';

import { shallowMount, createLocalVue } from '@vue/test-utils';
import { document } from '@unitFixtures/documents';
import setupI18n from '@/locales/i18nSetup';

import documentsService from '@/service/documents';
import riskScoringService from '@/service/riskScoring';
import FrontSideOnly from '../FrontSideOnly';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);
localVue.use(VeeValidate);
localVue.use(UIComponents);

describe('UploadDocument > FrontSideOnly', () => {
  let wrapper;

  const docId = document.id;
  const file = new File([''], 'filename');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  const createWrapper = () => {
    return shallowMount(FrontSideOnly, {
      localVue,
      i18n,
      sync: false,
      propsData: {
        documentId: docId,
      },
    });
  };

  const emitUpload = async () => {
    wrapper.find('drop-area-stub').vm.$emit('change', [file]);
    wrapper.find('footerfrontbuttons-stub').vm.$emit('upload');
    await global.flushPromises();
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = createWrapper();
  });

  it('should upload front side of document and recognize', async () => {
    expect.assertions(2);

    expect(wrapper.emitted().confirm).toBeUndefined();

    await emitUpload();

    expect(wrapper.emitted().confirm).toEqual([[document]]);
  });

  it('should send fingerprint after upload', async () => {
    expect.assertions(2);

    expect(riskScoringService.sendUserMetrics).not.toBeCalled();

    await emitUpload();

    expect(riskScoringService.sendUserMetrics).toBeCalledTimes(1);
  });

  it('should not emit confirm, if error in recognize', async () => {
    expect.assertions(1);

    documentsService.confirmDocument.mockRejectedValueOnce(new Error());

    await emitUpload();

    expect(wrapper.emitted().confirm).toBeUndefined();
  });

  it('should not emit confirm, if error in upload', async () => {
    expect.assertions(1);

    documentsService.uploadFrontFile.mockRejectedValueOnce(new Error());

    await emitUpload();

    expect(wrapper.emitted().confirm).toBeUndefined();
  });

  it('should show error when upload', async () => {
    expect.assertions(2);

    documentsService.uploadFrontFile.mockRejectedValueOnce(new Error());

    expect(
      wrapper.find('document-upload-front-stub').attributes().error,
    ).toBeUndefined();

    await emitUpload();

    expect(wrapper.find('document-upload-front-stub').attributes().error).toBe(
      i18n.t('store.error.uploadDocument.default'),
    );
  });

  it('should show repeat buttons if recognize error', async () => {
    expect.assertions(2);

    documentsService.confirmDocument.mockRejectedValueOnce(new Error());

    expect(wrapper.find('footerrepeatbuttons-stub').exists()).toBe(false);

    await emitUpload();

    expect(wrapper.find('footerrepeatbuttons-stub').exists()).toBe(true);
  });

  it('should emit confirm after recognize', async () => {
    expect.assertions(2);

    documentsService.confirmDocument.mockRejectedValueOnce(new Error());

    expect(wrapper.emitted().confirm).toBeUndefined();

    await emitUpload();

    wrapper.find('footerrepeatbuttons-stub').vm.$emit('done');
    await global.flushPromises();

    expect(wrapper.emitted().confirm).toEqual([[document]]);
  });
});
