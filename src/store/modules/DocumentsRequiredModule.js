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

  docRequiredTypes = [];

  docTypesStatusList = [];

  selectedDocumentsIdList = [];

  signToken = new SignToken();

  get isAvailableToApply() {
    // TODO: move to controller
    const { selectedDocumentsByType } = this;

    return this.docRequiredTypes.every(
      documentType =>
        selectedDocumentsByType[documentType] &&
        selectedDocumentsByType[documentType].status === DOC_STATUSES.VERIFIED,
    );
  }

  get availableDocumentsList() {
    return this.docTypesStatusList.filter(
      ({ status }) => status === DOC_STATUSES.VERIFIED,
    );
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

  get answerResult() {
    return {
      signedString: this.signToken.stringify({
        selectedIds: this.selectedDocumentsIdList,
      }),
      filteredIdsList: this.selectedDocumentsIdList,
      isNeedUploadDocument: false,
    };
  }

  @Action
  selectDocumentForType({ documentType, documentId }) {
    const { selectedDocumentsByType, selectedDocumentsIdList } = this;

    const selectedDocumentByType = selectedDocumentsByType[documentType];

    this.selectedDocumentsIdList =
      selectedDocumentByType && selectedDocumentByType.id === documentId
        ? selectedDocumentsIdList.filter(
            selectedId => selectedId !== documentId,
          )
        : [...selectedDocumentsIdList, documentId];
  }

  /**
   *
   * @param {object} params
   * @param {string} params.documentId
   * @param {keyof typeof DOC_TYPES} params.documentType
   * @param {keyof typeof DOC_STATUSES} params.status
   * @returns {Promise<void>}
   */
  @Action
  async addDocTypeStatus({ documentId, documentType, status }) {
    const docTypesStatusList = this.docTypesStatusList.filter(
      structure => structure.id !== documentId,
    );
    this.docTypesStatusList = [
      ...docTypesStatusList,
      { id: documentId, documentType, status },
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
    const data = this.signToken.parse(signedString);
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
    await this.loadRequiredTypes(clientId);

    await this.setDocumentsSelected(signedString);

    const { docRequiredTypes, selectedDocumentsIdList } = this;
    if (docRequiredTypes.length && selectedDocumentsIdList.length) {
      return this.answerResult;
    }

    return {
      isNeedUploadDocument: docRequiredTypes.length !== 0,
    };
  }

  @Action
  answerCancel() {
    const result = Answer.createFail(ERRORS.CREATE_DOCUMENT);
    documentChannel.put(result);
  }

  @Action
  answerFinish() {
    const result = Answer.createOk(this.answerResult);
    documentChannel.put(result);
  }
}

export default DocumentsRequiredModule;
