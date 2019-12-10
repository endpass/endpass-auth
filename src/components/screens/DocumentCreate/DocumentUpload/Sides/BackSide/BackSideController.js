// @ts-check
import { VuexModule, Action, Module, Mutation } from 'vuex-class-modules';
import createController from '@/controllers/createController';
import i18n from '@/locales/i18n';

import documentsService from '@/service/documents';
import ProgressTimer from '@/class/ProgressTimer';
import { UPLOAD_CODE_ERRORS } from '../sidesConstants';
import NonReactive from '@/class/NonReactive';

@Module({ generateMutationSetters: true })
class BackSideController extends VuexModule {
  /**
   * @type {number}
   */
  progress = 0;

  /**
   * @type {string}
   */
  progressLabel = '';

  /**
   *
   * @param {import('vuex-class-modules').RegisterOptions} props
   */
  constructor(props) {
    super(props);
    this.timer = new NonReactive(/** @type {ProgressTimer} */ ({}));
  }

  /**
   * @return {import('axios').AxiosRequestConfig}
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
        const nextValue = value < 98 ? value : 98;
        this.getTimer().setProgress(nextValue);
      },
    };
  }

  /**
   * @return {ProgressTimer}
   */
  getTimer() {
    if (!(this.timer.value instanceof ProgressTimer)) {
      const timer = new ProgressTimer();
      timer.on(
        /**
         * @param {number} value
         */
        value => this.setProgress(value),
      );
      this.setTimer(timer);
    }
    return /** @type {ProgressTimer} */ (this.timer.value);
  }

  /**
   *
   * @param {number} value
   */
  @Mutation
  setProgress(value) {
    this.progress = Math.floor(value);
  }

  /**
   *
   * @param {ProgressTimer} timer
   */
  @Mutation
  setTimer(timer) {
    this.timer.value = timer;
  }

  /**
   *
   * @return {Error}
   * @param {object} e
   */
  createError(e) {
    const respCode = e.response && e.response.status;
    const res = new Error(
      UPLOAD_CODE_ERRORS[respCode] || UPLOAD_CODE_ERRORS.default,
    );
    return res;
  }

  /**
   *
   * @param {string} docId
   * @return {Promise<void>}
   */
  @Action
  async confirmAndWait(docId) {
    await documentsService.confirmDocument(docId);
    await documentsService.waitDocumentReady(docId);
    // await documentsService.waitDocumentRecognition(docId);
  }

  /**
   * @param {object} fields UserDocument object for upload
   * @param {string} fields.docId UserDocument type
   * @param {File} fields.file UserDocument file
   */
  @Action
  async upload({ file, docId }) {
    const timer = this.getTimer();
    try {
      this.progressLabel = i18n.t('components.uploadDocument.uploading');

      timer.startProgress(0, 50);
      await documentsService.uploadBackFile(
        {
          file,
          docId,
        },
        this.getUploadRequestConfig(),
      );

      this.progressLabel = i18n.t('components.uploadDocument.recognition');
      timer.continueProgress(50, 100);
      await this.confirmAndWait(docId);
    } catch (e) {
      throw this.createError(e);
    } finally {
      timer.fillAndStopProgress();
    }
  }

  /**
   * @param {string} docId
   * @return {Promise<void>}
   */
  @Action
  async recognize(docId) {
    const timer = this.getTimer();
    try {
      timer.startProgress();

      this.progressLabel = i18n.t('components.uploadDocument.recognition');
      await this.confirmAndWait(docId);
    } catch (e) {
      e.message = i18n.t('store.error.uploadDocument.confirm');
      throw e;
    } finally {
      timer.fillAndStopProgress();
    }
  }
}

export default () => createController(BackSideController);
