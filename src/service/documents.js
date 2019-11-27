// @ts-check
import omitBy from 'lodash.omitby';
import isNil from 'lodash.isnil';
import get from 'lodash/get';
import generators from '@endpass/utils/generators';
import request from '@/class/singleton/request';
import { DOCUMENT_SIDES, UPLOAD_STATUSES } from '@/constants';

const docBaseURL = `${ENV.VUE_APP_IDENTITY_API_URL}/documents`;

const CHECK_RECOGNIZE_TIMEOUT = 1000;

/**
 * @param {Promise} promise
 * @return {Promise<any>}
 */
const withSuccess = promise => {
  return promise.then(res => {
    if (res && !res.success) throw new Error(res.message);

    return res;
  });
};

/**
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 * */

const documentsService = {
  /**
   * @param {File} file UserDocument file
   * @returns {Promise}
   */
  async checkFile(file) {
    return withSuccess(request.upload(`${docBaseURL}/file/check`, { file }));
  },

  /**
   * @param {object} fields UserDocument object for upload
   * @param {string} fields.type UserDocument type
   * @param {string} [fields.description] UserDocument description
   */
  async createDocument({ type, description }) {
    const { message: docId } = await withSuccess(
      request.post(docBaseURL, omitBy({ type, description }, isNil)),
    );

    if (!docId) {
      throw new Error('Bad document id');
    }

    return docId;
  },

  /**
   * @param {string} docId
   * @return {Promise<void>}
   */
  async confirmDocument(docId) {
    return withSuccess(request.post(`${docBaseURL}/${docId}/confirm`));
  },

  /**
   * @param {object} data
   * @param {File} data.file
   * @param {string} data.docId
   * @param {AxiosRequestConfig} config
   * @return {Promise<void>}
   */
  async uploadFrontFile({ file, docId }, config) {
    return withSuccess(
      request.upload(`${docBaseURL}/${docId}/front`, { file }, config),
    );
  },

  /**
   * @param {object} data
   * @param {File} data.file
   * @param {string} data.docId
   * @param {AxiosRequestConfig} config
   * @return {Promise<void>}
   */
  async uploadBackFile({ file, docId }, config) {
    return withSuccess(
      request.upload(`${docBaseURL}/${docId}/back`, { file }, config),
    );
  },

  /**
   *
   * @template {typeof UPLOAD_STATUSES} T
   * @param {string} id
   * @return {Promise<T[keyof T]>}
   */
  async getDocumentsUploadStatusById(id) {
    const data = await request.get(`${docBaseURL}/${id}/status/upload`);
    const frontSideStatus = get(data, `${DOCUMENT_SIDES.FRONT}.status`);
    const backSideStatus = get(data, `${DOCUMENT_SIDES.BACK}.status`);

    if (backSideStatus === UPLOAD_STATUSES.NO_CONTENT) {
      return frontSideStatus;
    }

    if (frontSideStatus === UPLOAD_STATUSES.UPLOADED) {
      return backSideStatus;
    }

    return frontSideStatus;
  },

  /**
   *
   * @param {string} docId
   * @return {Promise<void>}
   */
  async waitDocumentRecognition(docId) {
    // eslint-disable-next-line no-unused-vars
    for await (const index of generators.repeatWithInterval(
      CHECK_RECOGNIZE_TIMEOUT,
    )) {
      const status = await documentsService.getDocumentsUploadStatusById(docId);

      if (status === UPLOAD_STATUSES.ERRORED) {
        throw new Error('Recognize error');
      }

      if (status !== UPLOAD_STATUSES.PROCESSING) {
        break;
      }
    }
  },
};

export default documentsService;
