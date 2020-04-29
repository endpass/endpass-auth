import { VuexModule, Module, Action } from 'vuex-class-modules';
import documentsService from '@/service/documents';
import { DOC_STATUSES, DOC_TYPES_ORDER } from '@/constants';

const GOOD_STATUSES = [
  //
  DOC_STATUSES.VERIFIED,
  DOC_STATUSES.PENDING_REVIEW,
];

const PRIORITY = {
  [DOC_STATUSES.VERIFIED]: 1,
  [DOC_STATUSES.PENDING_REVIEW]: 2,
  [DOC_STATUSES.NOT_VERIFIED]: 3,
  [DOC_STATUSES.NOT_READABLE]: 4,
  [DOC_STATUSES.DRAFT]: 5,
  [DOC_STATUSES.RECOGNITION]: 6,
};

/**
 * @typedef { import("@/constants").DOC_TYPES } DOC_TYPES
 */

@Module({ generateMutationSetters: true })
class DocumentsRequiredModule extends VuexModule {
  clientId = '';

  docRequiredTypes = [];

  docTypesStatusList = [];

  /**
   * @returns {boolean}
   */
  get isNeedUploadDocument() {
    if (this.docRequiredTypes.length === 0) {
      return false;
    }

    if (this.docTypesStatusList.length === 0) {
      return true;
    }

    return !this.isStatusesVerified;
  }

  /**
   * @returns {boolean}
   */
  get isStatusesVerified() {
    return this.docRequiredTypes.every(type => {
      const status = this.docTypeToStatus[type];
      return status === DOC_STATUSES.VERIFIED;
    });
  }

  /**
   * @returns {boolean}
   */
  get isStatusesAppropriated() {
    return this.docRequiredTypes.every(type => {
      const status = this.docTypeToStatus[type];
      return GOOD_STATUSES.includes(status);
    });
  }

  get docTypeToStatus() {
    return this.docTypesStatusList.reduce((statusMap, document) => {
      const { documentType, status } = document;

      if (!this.isStatusAppliedToDocType(statusMap, documentType, status)) {
        return statusMap;
      }

      return {
        ...statusMap,
        [documentType]: status,
      };
    }, {});
  }

  /**
   * @private
   * @param {{}} docTypeToStatus
   * @param {keyof typeof DOC_TYPES} documentType
   * @param {keyof typeof DOC_STATUSES} status
   * @returns {boolean}
   */
  isStatusAppliedToDocType(docTypeToStatus, documentType, status) {
    if (!this.docRequiredTypes.includes(documentType)) {
      return false;
    }

    const currentStatus = docTypeToStatus[documentType];

    if (!currentStatus) {
      return true;
    }

    if (PRIORITY[status] > PRIORITY[currentStatus]) {
      return false;
    }

    return true;
  }

  /**
   *
   * @param {object} params
   * @param {keyof typeof DOC_TYPES} params.documentType
   * @param {keyof typeof DOC_STATUSES} params.status
   * @returns {Promise<void>}
   */
  @Action
  async addDocTypeStatus({ documentType, status }) {
    this.docTypesStatusList = [
      ...this.docTypesStatusList,
      { documentType, status },
    ];
  }

  /**
   * @private
   * @returns {Promise<void>}
   */
  @Action
  async loadDocumentsTypesAndStatuses() {
    const { items } = await documentsService.getDocumentsList();
    this.docTypesStatusList = items.map(({ documentType, status }) => ({
      documentType,
      status,
    }));
  }

  /**
   * @param {string} clientId
   * @returns {Promise<void>}
   */
  @Action
  async loadRequiredTypes(clientId) {
    if (this.docRequiredTypes.length) {
      return;
    }

    const requiredTypes = await documentsService.getRequiredDocumentsTypes(
      clientId,
    );

    this.docRequiredTypes = DOC_TYPES_ORDER.filter(docType =>
      requiredTypes.includes(docType),
    );
  }

  /**
   *
   * @param {object} params
   * @param {string} params.clientId
   * @returns {Promise<{isNeedUploadDocument: boolean}>}
   */
  @Action
  async checkRequired({ clientId }) {
    this.clientId = clientId;
    await Promise.all([
      this.loadRequiredTypes(clientId),
      this.loadDocumentsTypesAndStatuses(),
    ]);

    return {
      isNeedUploadDocument: this.isNeedUploadDocument,
    };
  }
}

export default DocumentsRequiredModule;
