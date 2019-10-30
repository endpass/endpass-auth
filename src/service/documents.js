// @ts-check
import omitBy from 'lodash.omitby';
import isNil from 'lodash.isnil';
import request from '@/class/singleton/request';

const docBaseURL = `${ENV.VUE_APP_IDENTITY_API_URL}/documents`;

/**
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 * */

export default {
  /**
   * @param {File} file UserDocument file
   * @returns {Promise}
   */
  async checkFile(file) {
    return request.upload(`${docBaseURL}/file/check`, { file });
  },

  /**
   * @param {object} fields UserDocument object for upload
   * @param {string} fields.type UserDocument type
   * @param {string} [fields.description] UserDocument description
   */
  async createDocument({ type, description }) {
    const { message: docId } = await request.post(
      docBaseURL,
      omitBy({ type, description }, isNil),
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
    return request.post(`${docBaseURL}/${docId}/confirm2`);
  },

  /**
   * @param {object} data
   * @param {File} data.file
   * @param {string} data.docId
   * @param {AxiosRequestConfig} config
   * @return {Promise<void>}
   */
  async uploadFrontFile({ file, docId }, config) {
    return request.upload(`${docBaseURL}/${docId}/front`, { file }, config);
  },

  /**
   * @param {object} data
   * @param {File} data.file
   * @param {string} data.docId
   * @param {AxiosRequestConfig} config
   * @return {Promise<void>}
   */
  async uploadBackFile({ file, docId }, config) {
    return request.upload(`${docBaseURL}/${docId}/back`, { file }, config);
  },

  /**
   *
   * @param {string} id
   * @return {Promise<import('axios').AxiosResponse>}
   */
  getDocumentsUploadStatusById(id) {
    return request.get(`${docBaseURL}/${id}/status/upload`);
  },
};
