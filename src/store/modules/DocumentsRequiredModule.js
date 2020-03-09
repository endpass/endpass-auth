import { VuexModule, Module, Action } from 'vuex-class-modules';
import documentsService from '@/service/documents';
import { DOC_STATUSES } from '@/constants';

@Module({ generateMutationSetters: true })
class DocumentsRequiredModule extends VuexModule {
  clientId = '';

  docRequiredTypes = [];

  isNeedUploadDocument(documentsList) {
    if (this.docRequiredTypes.length === 0) {
      return false;
    }

    if (documentsList.length === 0) {
      return true;
    }

    return !documentsList.every(
      document =>
        this.docRequiredTypes.includes(document.documentType) &&
        document.status === DOC_STATUSES.VERIFIED,
    );
  }

  @Action
  async loadRequiredTypes(clientId) {
    if (this.clientId && this.docRequiredTypes.length) {
      return;
    }

    this.docRequiredTypes = await documentsService.getRequiredDocumentsTypes(
      clientId,
    );

    this.clientId = clientId;
  }

  @Action
  async checkRequired({ clientId, data }) {
    await this.loadRequiredTypes(clientId);

    return {
      isNeedUploadDocument: this.isNeedUploadDocument(data),
    };
  }
}

export default DocumentsRequiredModule;
