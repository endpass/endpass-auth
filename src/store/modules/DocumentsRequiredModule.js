import { VuexModule, Module, Action } from 'vuex-class-modules';
import ConnectError from '@endpass/connect/error';
import documentsService from '@/service/documents';
import { DOC_STATUSES, DOC_TYPES_ORDER } from '@/constants';
import SignToken from '@/class/SignToken';
import Answer from '@/class/Answer';
import { documentChannel } from '@/class/singleton/channels';

const { ERRORS } = ConnectError;

/**
 * @typedef { import("@/constants").DOC_TYPES } DOC_TYPES
 */

@Module({ generateMutationSetters: true })
class DocumentsRequiredModule extends VuexModule {
  clientId = '';

  /**
   * @type {<keyof typeof DOC_TYPES>[]}
   */
  docRequiredTypes = [];

  /**
   * @type {UserDocument[]}
   */
  documentsList = [];

  /**
   * @type {string[]}
   */
  selectedDocumentsIdList = [];

  signToken = new SignToken();

  /**
   * @returns {boolean}
   */
  get isAllDocRequiredTypesVerified() {
    const { selectedDocumentsByType } = this;

    return this.docRequiredTypes.every(documentType => {
      const document = selectedDocumentsByType[documentType] || {};

      if (document.status === DOC_STATUSES.VERIFIED) return true;
      return false;
    });
  }

  /**
   * @returns {boolean}
   */
  get isAvailableToFinish() {
    const { selectedDocumentsByType } = this;

    return this.docRequiredTypes.every(documentType => {
      const document = selectedDocumentsByType[documentType] || {};

      if (
        document.status === DOC_STATUSES.PENDING_REVIEW ||
        document.status === DOC_STATUSES.VERIFIED
      ) {
        return true;
      }

      return false;
    });
  }

  /**
   * @returns {boolean}
   */
  get isNeedUploadDocument() {
    const { selectedDocumentsByType } = this;

    const isAllVerified = this.docRequiredTypes.every(
      documentType =>
        selectedDocumentsByType[documentType] &&
        selectedDocumentsByType[documentType].status === DOC_STATUSES.VERIFIED,
    );
    return !isAllVerified;
  }

  /**
   * @returns {UserDocument[]}
   */
  get availableDocumentsList() {
    return this.documentsList.filter(
      ({ status }) => status === DOC_STATUSES.VERIFIED,
    );
  }

  /**
   *
   * @returns {{key in [keyof typeof DOC_TYPES]: UserDocument}}
   */
  get selectedDocumentsByType() {
    const selectedDocStructuresList = this.documentsList.filter(structure =>
      this.selectedDocumentsIdList.includes(structure.id),
    );

    return selectedDocStructuresList.reduce(
      (docByTypeMap, structure) => ({
        ...docByTypeMap,
        [structure.documentType]: structure,
      }),
      {},
    );
  }

  /**
   *
   * @returns {{isNeedUploadDocument: boolean, signedString: string, filteredIdsList: string[]}}
   */
  get answerResult() {
    const signedString = this.signToken.stringify({
      selectedIds: this.selectedDocumentsIdList,
    });

    return {
      signedString,
      filteredIdsList: this.selectedDocumentsIdList,
      isNeedUploadDocument: this.isNeedUploadDocument,
    };
  }

  /**
   *
   * @param {object} params
   * @param {keyof typeof DOC_TYPES} documentType
   * @param {string} documentId
   */
  @Action
  selectDocumentForType({ documentType, documentId }) {
    const { selectedDocumentsByType, docRequiredTypes } = this;

    this.selectedDocumentsIdList = docRequiredTypes.reduce(
      (documentIdsList, documentTypeKey) => {
        const document = selectedDocumentsByType[documentTypeKey];

        if (document && document.id === documentId) return documentIdsList;

        if (documentTypeKey === documentType)
          return [...documentIdsList, documentId];

        if (document) return [...documentIdsList, document.id];

        return documentIdsList;
      },
      [],
    );
  }

  /**
   *
   * @param {UserDocument} document
   * @returns {Promise<void>}
   */
  @Action
  async addDocTypeStatus(document) {
    const { id, documentType, dateOfExpiry, status } = document;
    const documentsList = this.documentsList.filter(
      structure => structure.id !== id,
    );

    this.documentsList = [
      ...documentsList,
      { id, documentType, status, dateOfExpiry },
    ];
  }

  /**
   * @param {string} clientId
   * @returns {Promise<void>}
   */
  @Action
  async loadRequiredTypes(clientId) {
    const requiredTypes = await documentsService.getRequiredDocumentsTypes(
      clientId,
    );

    this.docRequiredTypes = DOC_TYPES_ORDER.filter(docType =>
      requiredTypes.includes(docType),
    );
  }

  /**
   * @param {string} signedString
   */
  @Action
  setSelectedDocIdsFromSignString(signedString) {
    this.selectedDocumentsIdList = [];
    try {
      const data = this.signToken.parse(signedString);
      if (!Array.isArray(data.selectedIds)) return;
      this.selectedDocumentsIdList = data.selectedIds;
    } catch (e) {}
  }

  /**
   *
   * @param {object} params
   * @param {string} params.clientId
   * @returns {Promise<{isNeedUploadDocument: boolean}>}
   */
  @Action
  async checkRequired({ clientId, documentsList, signedString }) {
    if (this.clientId !== clientId) {
      this.docRequiredTypes = [];
    }
    this.clientId = clientId;
    this.documentsList = documentsList;

    if (!this.docRequiredTypes.length) {
      await this.loadRequiredTypes(clientId);
    }

    await this.setSelectedDocIdsFromSignString(signedString);

    return this.answerResult;
  }

  /**
   * @return {Promise<void>}
   */
  @Action
  async answerCancel() {
    const result = Answer.createFail(ERRORS.CREATE_DOCUMENT);
    documentChannel.put(result);
  }

  /**
   * @return {Promise<void>}
   */
  @Action
  async answerFinish() {
    const result = Answer.createOk(this.answerResult);
    documentChannel.put(result);
  }
}

export default DocumentsRequiredModule;
