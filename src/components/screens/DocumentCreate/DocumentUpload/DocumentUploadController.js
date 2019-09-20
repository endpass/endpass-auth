// @ts-check
import { VuexModule, Action, Module, Mutation } from 'vuex-class-modules';
import get from 'lodash/get';
import generators from '@endpass/utils/generators';
import createController from '@/controllers/createController';

import documentsService from '@/service/documents';
import TranslateObjectFactory from '@/class/TranslateObjectFactory';
import { UPLOAD_STATUSES, DOCUMENT_SIDES } from '@/constants';

const { $t, createGetters } = TranslateObjectFactory;

/**
 * @typedef {{
 *   front: { status: string },
 *   back: { status: string },
 * }} DocumentUploadStatus
 */

/**
 * @type {{ [key: string]: string }} fields UserDocument object for upload
 */
const checkCodeErrors = createGetters({
  default: $t('store.error.checkFile.default'),
  422: $t('store.error.checkFile.invalidFile'),
});

/**
 * @type {{ [key: string]: string }} fields UserDocument object for upload
 */
const uploadCodeErrors = createGetters({
  default: $t('store.error.uploadDocument.default'),
  409: $t('store.error.uploadDocument.exist'),
  406: $t('store.error.uploadDocument.sizeLimit'),
});

const docMethods = {
  [DOCUMENT_SIDES.FRONT]: documentsService.uploadFrontFile,
  [DOCUMENT_SIDES.BACK]: documentsService.uploadBackFile,
};

const PROGRESS_TYPES = {
  CHECK: 'CHECK',
  UPLOAD: 'UPLOAD',
  RECOGNIZE: 'RECOGNIZE',
};

const DEFAULT_TIMER_PROGRESS = 1000;
const CHECK_RECOGNIZE_TIMEOUT = 1000;

@Module({ generateMutationSetters: true })
class DocumentUploadController extends VuexModule {
  /**
   *
   * @type {boolean}
   */
  isTimersPlay = false;

  progressValues = {
    [PROGRESS_TYPES.CHECK]: 0,
    [PROGRESS_TYPES.UPLOAD]: 0,
    [PROGRESS_TYPES.RECOGNIZE]: 0,
  };

  /**
   *
   * @type {boolean}
   */
  isUploading = false;

  /**
   *
   * @type {boolean}
   */
  isProcessing = false;

  /**
   * @type {string}
   */
  docId = '';

  /**
   * Return integer number, not float
   * @return {number}
   */
  get progress() {
    const { progressValues } = this;
    return Math.floor(
      progressValues[PROGRESS_TYPES.CHECK] * 0.1 +
        progressValues[PROGRESS_TYPES.UPLOAD] * 0.4 +
        progressValues[PROGRESS_TYPES.RECOGNIZE] * 0.5,
    );
  }

  /**
   * @return {{onUploadProgress: function}}
   */
  getUploadRequestConfig() {
    return {
      /**
       * @param {{
       *   loaded: number,
       *   total: number
       * }} progressEvent
       */
      onUploadProgress: ({ loaded, total }) => {
        const value = Math.round((loaded * 100) / total) || 0;

        this.updateProgress({
          type: PROGRESS_TYPES.UPLOAD,
          nextValue: value < 98 ? value : 98,
        });
      },
    };
  }

  /**
   * @param {object} props
   * @param {string} props.type
   * @param {number} props.nextValue
   */
  @Mutation
  updateProgress({ type, nextValue }) {
    const currValue = this.progressValues[type];
    if (nextValue < currValue) {
      return;
    }
    this.progressValues[type] = nextValue >= 100 ? 100 : nextValue;
  }

  @Mutation
  dropProgress() {
    this.progressValues[PROGRESS_TYPES.CHECK] = 0;
    this.progressValues[PROGRESS_TYPES.RECOGNIZE] = 0;
    this.progressValues[PROGRESS_TYPES.UPLOAD] = 0;
  }

  /**
   * @param {object} props
   * @param {string} props.type
   * @param {number} props.time
   */
  @Action
  async startTimerProgress({ type, time }) {
    const perSecond = 100 / (time / 1000);
    // eslint-disable-next-line no-unused-vars
    for await (const index of generators.repeatWithInterval(
      DEFAULT_TIMER_PROGRESS,
    )) {
      const val = this.progressValues[type];
      const nextValue = val + perSecond;
      this.updateProgress({
        type,
        nextValue,
      });
      if (nextValue >= 100 || !this.isTimersPlay) {
        break;
      }
    }
  }

  /**
   * @param {File} file UserDocument
   */
  @Action
  async checkFile(file) {
    try {
      await documentsService.checkFile(file);
    } catch (err) {
      err.message = checkCodeErrors[err.code] || checkCodeErrors.default;

      throw err;
    }
  }

  /**
   *
   * @param {object} props
   * @param {File} props.file
   * @param {string} props.type
   * @return {Promise<string>}
   */
  @Action
  async stepPrepareDocument({ file, type }) {
    this.startTimerProgress({
      type: PROGRESS_TYPES.CHECK,
      time: 10000,
    });

    await this.checkFile(file);
    if (!this.docId) {
      this.docId = await documentsService.createDocument({ type });
    }

    this.updateProgress({ type: PROGRESS_TYPES.CHECK, nextValue: 100 });
    return this.docId;
  }

  /**
   *
   * @param {object} props
   * @param {string} props.docSide
   * @param {File} props.file
   * @param {string} props.docId
   * @return {Promise<void>}
   */
  @Action
  async stepUploadDocument({ docSide, file, docId }) {
    await docMethods[docSide](
      {
        file,
        docId,
      },
      this.getUploadRequestConfig(),
    );
    this.updateProgress({ type: PROGRESS_TYPES.UPLOAD, nextValue: 100 });
  }

  /**
   * @param {object} props
   * @param {string} props.docId
   * @param {string} props.docSide
   * @return {Promise<void>}
   */
  @Action
  async stepRecognize({ docId, docSide }) {
    this.startTimerProgress({
      type: PROGRESS_TYPES.RECOGNIZE,
      time: 15000,
    });

    // eslint-disable-next-line no-unused-vars
    for await (const index of generators.repeatWithInterval(
      CHECK_RECOGNIZE_TIMEOUT,
    )) {
      const data = await documentsService.getDocumentsUploadStatusById(docId);
      const isProcessing =
        get(data, `${docSide}.status`) === UPLOAD_STATUSES.PROCESSING;

      if (!isProcessing) {
        break;
      }
    }

    this.updateProgress({ type: PROGRESS_TYPES.RECOGNIZE, nextValue: 100 });
  }

  /**
   * @param {object} fields UserDocument object for upload
   * @param {string} fields.type UserDocument type
   * @param {string} fields.docSide UserDocument side
   * @param {File} fields.file UserDocument file
   */
  @Action
  async uploadDocument({ file, type, docSide }) {
    if (this.isUploading || this.isProcessing) {
      throw new Error('Previous file uploading is not finished');
    }

    this.isUploading = true;
    this.isTimersPlay = true;
    try {
      const docId = await this.stepPrepareDocument({
        file,
        type,
      });

      await this.stepUploadDocument({
        docSide,
        file,
        docId,
      });

      this.isUploading = false;
      this.isProcessing = true;

      await this.stepRecognize({
        docSide,
        docId,
      });
    } catch (e) {
      e.message = uploadCodeErrors[e.code] || uploadCodeErrors.default;
      throw e;
    } finally {
      this.dropProgress();
      this.isUploading = false;
      this.isProcessing = false;
      this.isTimersPlay = false;
    }
  }
}

export default () => createController(DocumentUploadController);
