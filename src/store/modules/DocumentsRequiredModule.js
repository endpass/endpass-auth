import { VuexModule, Module, Action } from 'vuex-class-modules';
import documentsService from '@/service/documents';
import { DOC_STATUSES, DOC_TYPES_ORDER } from '@/constants';
import SignToken from '@/class/SignToken';

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

  selectedDocumentsIdList = [];

  signToken = new SignToken();

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

  get isAvailableToApply() {
    // TODO: move to controller
    const { docTypeToStatus } = this;
    return this.docRequiredTypes.every(
      documentType => docTypeToStatus[documentType] === DOC_STATUSES.VERIFIED,
    );
  }

  get availableDocumentsList() {
    return this.docTypesStatusList.filter(
      ({ status }) => status === DOC_STATUSES.VERIFIED,
    );
  }

  isSelectedDocumentsExpired(documentsList) {
    // TODO: expired date should be checked NOT in client
    const now = Date.now();
    return this.selectedDocumentsIdList.every(documentId => {
      const doc = documentsList.find(document => document.id === documentId);
      if (!doc) return false;
      if (doc.expiredDate < now) return false;
      return true;
    });
  }

  get selectedDocumentsByType() {
    const selectedDocStructuresList = this.docTypesStatusList.filter(
      structure => this.selectedDocumentsIdList.includes(structure.id),
    );

    return selectedDocStructuresList.reduce((docByTypeMap, structure) => {
      return {
        ...docByTypeMap,
        [structure.documentType]: structure,
      };
    }, {});
  }

  /**
   * @deprecated
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

  @Action
  selectDocumentForType({ documentType, documentId }) {
    const { selectedDocumentsByType } = this;
    delete selectedDocumentsByType[documentType];
    this.selectedDocumentsIdList = [
      ...Object.values(selectedDocumentsByType),
      documentId,
    ];
  }

  /**
   *
   * @param {object} params
   * @param {string} id
   * @param {keyof typeof DOC_TYPES} params.documentType
   * @param {keyof typeof DOC_STATUSES} params.status
   * @returns {Promise<void>}
   */
  @Action
  async addDocTypeStatus({ id, documentType, status }) {
    const docTypesStatusList = this.docTypesStatusList.filter(
      structure => structure.id !== id,
    );
    this.docTypesStatusList = [
      ...docTypesStatusList,
      { id, documentType, status },
    ];
  }

  /**
   * @private
   * @returns {Promise<void>}
   */
  @Action
  async loadDocumentsTypesAndStatuses(documentsList) {
    // TODO: after implement connect, remove checking for not defined documentsList
    if (!documentsList) {
      const { items } = await documentsService.getDocumentsList();
      // eslint-disable-next-line no-param-reassign
      documentsList = items;
    }

    this.docTypesStatusList = documentsList.map(
      ({ id, documentType, status }) => ({
        id,
        documentType,
        status,
      }),
    );
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

  @Action
  setDocumentsSelected(signedString) {
    const { data } = this.signToken.parse(signedString);
    if (!data) return;
    if (!Array.isArray(data.selectedIds)) return;
    this.selectedDocumentsIdList = data.selectedIds;
  }

  /**
   *
   * @param {object} params
   * @param {string} params.clientId
   * @returns {Promise<{isNeedUploadDocument: boolean}>}
   */
  @Action
  async checkRequired({ clientId, documentsList, signedString }) {
    this.clientId = clientId;

    await this.loadDocumentsTypesAndStatuses(documentsList);

    await this.setDocumentsSelected(signedString);

    if (
      this.selectedDocumentsIdList.length &&
      !this.isSelectedDocumentsExpired(documentsList)
    ) {
      // if all selected docs is not expired, return {}
      return {};
    }

    await this.loadRequiredTypes(clientId);

    return {
      isNeedUploadDocument: true, // this.isNeedUploadDocument,
    };
  }
}

export default DocumentsRequiredModule;
