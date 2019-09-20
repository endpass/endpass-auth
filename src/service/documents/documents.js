// @ts-check
import mapToQueryString from '@endpass/utils/mapToQueryString';
import request from '@/class/singleton/request';
import documentAdapter from './documentAdapter';
import { filterNullableParams, getFileFormData } from '@/services/shared/utils';

const baseURL = `${ENV.VUE_APP_IDENTITY_API_URL}/documents`;

export default {
  /**
   * @param {string} id
   * @return {Promise<UserDocument>}
   */
  async getDocument(id) {
    const res = await request.get(`${baseURL}/${id}`);
    return documentAdapter(res);
  },

  /**
   *
   * @param {string} id document id
   * @return {Promise<UserDocumentLog[]>}
   */
  async getDocumentStatusLog(id) {
    return request.get(`${baseURL}/${id}/status/log`);
  },

  /**
   * @param {object} params
   * @param {number} [params.offset]
   * @param {number} [params.limit]
   * @param {string} [params.status]
   * @return {Promise<{total: number, items: UserDocument[]}>}
   */
  async getDocumentList({ offset = 0, limit = 10, status }) {
    const path = mapToQueryString(
      baseURL,
      filterNullableParams({
        offset,
        limit,
        status,
      }),
    );

    const { items, total } = await request.get(path);

    return {
      items: items.map(documentAdapter),
      total,
    };
  },

  /**
   * @param {File} file UserDocument file
   * @returns {Promise}
   */
  async checkFile(file) {
    return request.upload(`${baseURL}/file/check`, getFileFormData(file));
  },

  /**
   * @param {object} fields UserDocument object for upload
   * @param {string} fields.type UserDocument type
   * @param {string} [fields.description] UserDocument description
   */
  async createDocument({ type, description }) {
    const { message: docId } = await request.post(
      baseURL,
      filterNullableParams({ type, description }),
    );

    if (!docId) {
      throw new Error('Bad document id');
    }

    return docId;
  },

  /**
   * @param {object} data
   * @param {File} data.file
   * @param {string} data.docId
   * @param {{onUploadProgress: function}} config
   * @return {Promise<void>}
   */
  async uploadFrontFile({ file, docId }, config) {
    return request.upload(
      `${baseURL}/${docId}/front`,
      getFileFormData(file),
      config,
    );
  },

  /**
   * @param {object} data
   * @param {File} data.file
   * @param {string} data.docId
   * @param {{onUploadProgress: function}} config
   * @return {Promise<void>}
   */
  async uploadBackFile({ file, docId }, config) {
    return request.upload(
      `${baseURL}/${docId}/back`,
      getFileFormData(file),
      config,
    );
  },

  /**
   * @param {string} id
   * @return {Promise<>}
   */
  async removeDocument(id) {
    return request.delete(`${baseURL}/${id}`);
  },

  /**
   *
   * @param {string} id
   * @return {Promise<import('axios').AxiosResponse>}
   */
  getDocumentsUploadStatusById(id) {
    return request.get(`${baseURL}/${id}/status/upload`);
  },

  getDocumentsUploadStatus() {
    return request.get(`${baseURL}/status/upload`);
  },
};
