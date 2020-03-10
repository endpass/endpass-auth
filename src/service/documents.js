// @ts-check
import omitBy from 'lodash.omitby';
import isNil from 'lodash.isnil';
import get from 'lodash/get';
import generators from '@endpass/utils/generators';
import request from '@/class/singleton/request';
import { DOC_STATUSES, DOCUMENT_SIDES, UPLOAD_STATUSES } from '@/constants';

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
   * @param {string} id
   * @return {Promise<*>}
   */
  async getDocumentStatus(id) {
    const document = await request.get(`${docBaseURL}/${id}`);
    if (!document) {
      throw new Error('Recognize error');
    }

    return document.status;
  },

  /**
   * @param {string} id
   * @return {Promise<void>}
   */
  async waitDocumentVerified(id) {
    const startTime = Date.now();
    const timeoutMS = 30000;
    const statuses = [DOC_STATUSES.VERIFIED];

    // eslint-disable-next-line no-unused-vars
    for await (const index of generators.repeatWithInterval(
      CHECK_RECOGNIZE_TIMEOUT,
    )) {
      const status = await documentsService.getDocumentStatus(id);

      if (statuses.includes(status)) {
        break;
      }

      const spendTime = Date.now() - startTime;
      if (timeoutMS && spendTime > timeoutMS) {
        break;
      }
    }
  },

  /**
   * @param {string} id
   * @return {Promise<void>}
   */
  async waitDocumentFinishRecognition(id) {
    const statuses = [DOC_STATUSES.RECOGNITION];

    // eslint-disable-next-line no-unused-vars
    for await (const index of generators.repeatWithInterval(
      CHECK_RECOGNIZE_TIMEOUT,
    )) {
      const status = await documentsService.getDocumentStatus(id);

      if (!statuses.includes(status)) {
        break;
      }
    }
  },

  /**
   *
   * @template {typeof UPLOAD_STATUSES} T
   * @param {string} id
   * @return {Promise<T[keyof T]>}
   */
  async getDocumentUploadStatusById(id) {
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
  async waitDocumentUpload(docId) {
    // eslint-disable-next-line no-unused-vars
    for await (const index of generators.repeatWithInterval(
      CHECK_RECOGNIZE_TIMEOUT,
    )) {
      const status = await documentsService.getDocumentUploadStatusById(docId);

      if (status === UPLOAD_STATUSES.ERRORED) {
        throw new Error('Recognize error');
      }

      if (status !== UPLOAD_STATUSES.PROCESSING) {
        break;
      }
    }
  },

  /**
   * @param {string} clientId
   * @return {Promise<any>}
   */
  async getRequiredDocumentsTypes(clientId) {
    return request.get(
      `${ENV.VUE_APP_IDENTITY_API_URL}/apps/${clientId}/documents/required`,
    );
  },

  /**
   * @return {Promise<any>}
   */
  async getDocumentsList() {
    const { items, total } = await request.get(docBaseURL);
    return {
      items,
      total,
    };
  },
};

export default documentsService;
