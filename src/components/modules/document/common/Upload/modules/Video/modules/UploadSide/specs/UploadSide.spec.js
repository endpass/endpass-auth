import VeeValidate from 'vee-validate';
import UIComponents from '@endpass/ui';

import { shallowMount, createLocalVue } from '@vue/test-utils';
import { document } from '@unitFixtures/documents';
import setupI18n from '@/locales/i18nSetup';

import UploadSide from '../UploadSide';
import documentsService from '@/service/documents';
import riskScoringService from '@/service/riskScoring';
import { DOC_TYPES } from '@/constants';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);
localVue.use(VeeValidate);
localVue.use(UIComponents);

describe('UploadVideo > UploadSide', () => {
  let wrapper;

  const file = new File([''], 'filename');

  const createWrapper = options => {
    return shallowMount(UploadSide, {
      localVue,
      i18n,
      sync: false,
      propsData: {
        documentType: DOC_TYPES.PASSPORT,
      },
      ...options,
    });
  };

  const emitUpload = async () => {
    wrapper = createWrapper({
      propsData: {
        documentType: DOC_TYPES.SELFIE,
        recordedFile: file,
      },
    });

    wrapper.find('[data-test=upload-button]').vm.$emit('click');
    await global.flushPromises();
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect.assertions(2);

      expect(wrapper.name()).toBe('UploadSide');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should not be able to upload file from pc if selfie', () => {
      expect.assertions(1);

      wrapper = createWrapper({
        propsData: {
          documentType: DOC_TYPES.SELFIE,
          recordedFile: file,
        },
      });

      expect(wrapper.find('drop-area-stub').exists()).toBe(false);
    });

    it('should suggest to use mobile app if selfie', () => {
      expect.assertions(1);

      wrapper = createWrapper({
        propsData: {
          documentType: DOC_TYPES.SELFIE,
          recordedFile: file,
        },
      });

      expect(wrapper.find('mobile-suggestions-stub').exists()).toBe(true);
    });
  });

  describe('behavior', () => {
    it('should upload recorded file and confirm document', async () => {
      expect.assertions(2);

      expect(wrapper.emitted().confirm).toBeUndefined();

      wrapper = createWrapper({
        propsData: {
          documentType: DOC_TYPES.PASSPORT,
          recordedFile: file,
        },
      });

      wrapper.find('[data-test=upload-button]').vm.$emit('click');
      await global.flushPromises();

      expect(wrapper.emitted().confirm).toEqual([[document]]);
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
      expect.assertions(2);

      documentsService.confirmDocument.mockRejectedValueOnce(new Error());

      expect(wrapper.emitted().confirm).toBeUndefined();

      await emitUpload();
      await global.flushPromises();

      expect(wrapper.emitted().confirm).toBeUndefined();
    });

    it('should not emit confirm, if error in upload', async () => {
      expect.assertions(1);

      documentsService.uploadFrontFile.mockRejectedValueOnce(new Error());

      await emitUpload();

      expect(wrapper.emitted().confirm).toBeUndefined();
    });

    it('should emit confirm after recognize', async () => {
      expect.assertions(2);

      expect(wrapper.emitted().confirm).toBeUndefined();

      await emitUpload();

      await wrapper.vm.$nextTick();

      expect(wrapper.emitted().confirm).toEqual([[document]]);
    });

    it('should confirm after upload', async () => {
      expect.assertions(2);

      expect(documentsService.confirmDocument).not.toBeCalled();

      await emitUpload();
      await global.flushPromises();

      expect(documentsService.confirmDocument).toBeCalledTimes(1);
    });
  });
});
