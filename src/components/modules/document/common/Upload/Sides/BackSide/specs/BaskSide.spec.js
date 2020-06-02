import VeeValidate from 'vee-validate';
import UIComponents from '@endpass/ui';

import { shallowMount, createLocalVue } from '@vue/test-utils';
import { document } from '@unitFixtures/documents';
import setupI18n from '@/locales/i18nSetup';

import documentsService from '@/service/documents';

import BackSide from '../BackSide';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);
localVue.use(VeeValidate);
localVue.use(UIComponents);

describe('UploadDocument > BackSide', () => {
  let wrapper;

  const docId = document.id;
  const file = new File([''], 'filename');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  const createWrapper = () => {
    return shallowMount(BackSide, {
      localVue,
      i18n,
      sync: false,
      propsData: {
        documentId: docId,
      },
    });
  };

  const emitDone = async () => {
    wrapper.find('footerdonebuttons-stub').vm.$emit('done');
    await global.flushPromises();
  };

  const emitUpload = async () => {
    wrapper.find('drop-area-stub').vm.$emit('change', [file]);
    wrapper.find('footerdonebuttons-stub').vm.$emit('upload');
    await global.flushPromises();
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = createWrapper();
  });

  describe('recognize only without upload', () => {
    it('should recognize only without upload', async () => {
      expect.assertions(1);

      await emitDone();

      expect(wrapper.emitted().confirm).toEqual([[document]]);
    });

    it('should show repeat buttons if have recognize errors', async () => {
      expect.assertions(2);

      documentsService.confirmDocument.mockRejectedValueOnce(new Error());

      expect(wrapper.find('footerrepeatbuttons-stub').exists()).toBe(false);

      await emitDone();

      expect(wrapper.find('footerrepeatbuttons-stub').exists()).toBe(true);
    });

    it('should show error if have recognize errors', async () => {
      expect.assertions(1);

      documentsService.confirmDocument.mockRejectedValueOnce(new Error());

      await emitDone();

      expect(wrapper.find('document-upload-back-stub').attributes().error).toBe(
        i18n.t('store.error.uploadDocument.confirm'),
      );
    });

    it('should not emit confirm', async () => {
      expect.assertions(1);

      documentsService.confirmDocument.mockRejectedValueOnce(new Error());

      await emitDone();

      expect(wrapper.emitted().confirm).toBeUndefined();
    });
  });

  describe('upload and recognize', () => {
    it('should upload back side of document and recognize', async () => {
      expect.assertions(1);

      await emitUpload();

      expect(wrapper.emitted().confirm).toEqual([[document]]);
    });

    it('should not emit confirm, if error', async () => {
      expect.assertions(1);

      documentsService.confirmDocument.mockRejectedValueOnce(new Error());

      await emitUpload();

      expect(wrapper.emitted().confirm).toBeUndefined();
    });

    it('should show error when upload', async () => {
      expect.assertions(2);

      documentsService.uploadBackFile.mockRejectedValueOnce(new Error());

      expect(
        wrapper.find('document-upload-back-stub').attributes().error,
      ).toBeUndefined();

      await emitUpload();

      expect(wrapper.find('document-upload-back-stub').attributes().error).toBe(
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
  });
});
