import { VuexModule, Module, Action } from 'vuex-class-modules';
import ConnectError from '@endpass/connect/error';
import documentsService from '@/service/documents';
import { DOC_STATUSES, DOC_TYPES_ORDER } from '@/constants';
import Answer from '@/class/Answer';
import { documentChannel } from '@/class/singleton/channels';

const { ERRORS } = ConnectError;

/**
 * @typedef { import("@/constants").DOC_TYPES } DOC_TYPES
 */

/**
 * @typedef {{
 * isNeedUploadDocument: boolean,
 * signedString: string,
 * filteredIdsList: string[]}} AnswerResult
 */

@Module({ generateMutationSetters: true })
class DocumentsRequiredModule extends VuexModule {
  clientId = '';

  /**
   * @type {Array<typeof DOC_TYPES[keyof typeof DOC_TYPES]>}
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
   * @returns {AnswerResult}
   */
  get answerResult() {
    return {
      filteredIdsList: this.selectedDocumentsIdList,
      isNeedUploadDocument: !this.isAvailableToFinish,
    };
  }

  /**
   * @param {object} params
   * @param {keyof typeof DOC_TYPES} params.documentType
   * @param {string} params.documentId
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
    const { id } = document;
    const documentsList = this.documentsList.filter(
      structure => structure.id !== id,
    );

    this.documentsList = [...documentsList, document];
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

  @Action
  async loadDocumentsList() {
    this.documentsList = await documentsService.getDocumentsList({
      status: DOC_STATUSES.VERIFIED,
    });
  }

  /**
   * @param {string} clientId
   * @returns {Promise<void>}
   */
  @Action
  async loadSelectedDocuments(clientId) {
    const selectedDocByTypes = await documentsService.getSelectedDocuments(
      clientId,
    );
    this.selectedDocumentsIdList = Object.values(selectedDocByTypes);
  }

  @Action
  async saveSelectedDocuments(clientId) {
    const selectedDocumentsTypeMap = this.selectedDocumentsByType;
    const selectedDocumentsMap = Object.keys(selectedDocumentsTypeMap).reduce(
      (selectedTypesIds, docType) => {
        const { id } = selectedDocumentsTypeMap[docType];
        return {
          ...selectedTypesIds,
          [docType]: id,
        };
      },
      {},
    );

    await documentsService.saveSelectedDocuments({
      clientId,
      selectedDocumentsMap,
    });
  }

  @Action
  async clearSelectedDocuments() {
    this.selectedDocumentsIdList = [];
  }

  /**
   * @param {object} params
   * @param {string} params.clientId
   * @returns {Promise<AnswerResult>}
   */
  @Action
  async checkRequired({ clientId }) {
    if (this.clientId !== clientId) {
      this.docRequiredTypes = [];
    }
    this.clientId = clientId;

    if (!this.docRequiredTypes.length) {
      await this.loadRequiredTypes(clientId);
    }

    await this.loadSelectedDocuments(clientId);
    await this.loadDocumentsList();

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
    await this.saveSelectedDocuments(this.clientId);
    const result = Answer.createOk(this.answerResult);
    documentChannel.put(result);
  }
}

export default DocumentsRequiredModule;
