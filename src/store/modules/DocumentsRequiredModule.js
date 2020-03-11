import { VuexModule, Module, Action, Mutation } from 'vuex-class-modules';
import documentsService from '@/service/documents';
import { DOC_STATUSES } from '@/constants';

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

@Module({ generateMutationSetters: true })
class DocumentsRequiredModule extends VuexModule {
  docTypeToStatus = {};

  docRequiredTypes = [];

  documentsList = [];

  get isNeedUploadDocument() {
    if (this.docRequiredTypes.length === 0) {
      return false;
    }

    if (this.documentsList.length === 0) {
      return true;
    }

    return !this.isRequiredDocsVerifiedStatus;
  }

  get isRequiredDocsVerifiedStatus() {
    return this.docRequiredTypes.every(type => {
      const status = this.docTypeToStatus[type];
      return status === DOC_STATUSES.VERIFIED;
    });
  }

  get isHasBadStatus() {
    const isGoodStatuses = this.docRequiredTypes.every(type => {
      const status = this.docTypeToStatus[type];
      return GOOD_STATUSES.includes(status);
    });

    return !isGoodStatuses;
  }

  @Mutation
  updateDocTypeToStatus() {
    this.docTypeToStatus = this.documentsList.reduce((statusMap, document) => {
      const { documentType, status } = document;
      if (!this.docRequiredTypes.includes(documentType)) {
        return statusMap;
      }
      const currentStatus = statusMap[documentType];
      if (PRIORITY[status] > PRIORITY[currentStatus]) {
        return statusMap;
      }
      return {
        ...statusMap,
        [documentType]: status,
      };
    }, {});
  }

  @Action
  async loadDocuments() {
    const { items } = await documentsService.getDocumentsList();
    this.documentsList = items;
    this.updateDocTypeToStatus();
  }

  @Action
  async loadRequiredTypes(clientId) {
    if (this.docRequiredTypes.length) {
      return;
    }

    this.docRequiredTypes = await documentsService.getRequiredDocumentsTypes(
      clientId,
    );
  }

  @Action
  async checkRequired({ clientId }) {
    await Promise.all([
      //
      this.loadRequiredTypes(clientId),
      this.loadDocuments(),
    ]);

    this.updateDocTypeToStatus();

    return {
      isNeedUploadDocument: this.isNeedUploadDocument,
    };
  }
}

export default DocumentsRequiredModule;
