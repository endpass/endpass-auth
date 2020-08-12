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
        documentType: DOC_TYPES.SELFIE,
        recordedFile: file,
      },
      ...options,
    });
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

    it('should suggest to use mobile app if selfie', async () => {
      expect.assertions(1);

      expect(wrapper.find('mobile-suggestions-stub').exists()).toBe(true);
    });
  });

  describe('behavior', () => {
    it('should upload recorded file and confirm document', async () => {
      expect.assertions(2);

      expect(wrapper.emitted().confirm).toBeUndefined();

      wrapper.find('[data-test=upload-button]').vm.$emit('click');
      await global.flushPromises();

      expect(wrapper.emitted().confirm).toEqual([[document]]);
    });

    it('should upload front side of document and recognize', async () => {
      expect.assertions(2);

      expect(wrapper.emitted().confirm).toBeUndefined();

      wrapper.find('[data-test=upload-button]').vm.$emit('click');
      await global.flushPromises();

      expect(wrapper.emitted().confirm).toEqual([[document]]);
    });

    it('should send fingerprint after upload', async () => {
      expect.assertions(2);

      expect(riskScoringService.sendUserMetrics).not.toBeCalled();

      wrapper.find('[data-test=upload-button]').vm.$emit('click');
      await global.flushPromises();

      expect(riskScoringService.sendUserMetrics).toBeCalledTimes(1);
    });

    it('should not emit confirm, if error in recognize', async () => {
      expect.assertions(2);

      documentsService.confirmDocument.mockRejectedValueOnce(new Error());

      expect(wrapper.emitted().confirm).toBeUndefined();

      wrapper.find('[data-test=upload-button]').vm.$emit('click');
      await global.flushPromises();

      expect(wrapper.emitted().confirm).toBeUndefined();
    });

    it('should not emit confirm, if error when upload', async () => {
      expect.assertions(1);

      documentsService.uploadFrontFile.mockRejectedValueOnce(new Error());

      wrapper.find('[data-test=upload-button]').vm.$emit('click');
      await global.flushPromises();

      expect(wrapper.emitted().confirm).toBeUndefined();
    });

    it('should show error, if error when upload', async () => {
      expect.assertions(1);

      documentsService.uploadFrontFile.mockRejectedValueOnce(new Error());

      wrapper.find('[data-test=upload-button]').vm.$emit('click');

      await global.flushPromises();
      await wrapper.vm.$nextTick();

      expect(wrapper.find('[data-test=upload-side-error]').text()).toMatch(
        wrapper.vm.$t('store.error.uploadDocument.default'),
      );
    });

    it('should emit confirm after recognize', async () => {
      expect.assertions(2);

      expect(wrapper.emitted().confirm).toBeUndefined();

      wrapper.find('[data-test=upload-button]').vm.$emit('click');
      await global.flushPromises();

      expect(wrapper.emitted().confirm).toEqual([[document]]);
    });

    it('should confirm after upload', async () => {
      expect.assertions(2);

      expect(documentsService.confirmDocument).not.toBeCalled();

      wrapper.find('[data-test=upload-button]').vm.$emit('click');
      await global.flushPromises();

      expect(documentsService.confirmDocument).toBeCalledTimes(1);
    });
  });
});
