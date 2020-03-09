import { VuexModule, Action, Module } from 'vuex-class-modules';
import ConnectError from '@endpass/connect/error';
import createController from '@/controllers/createController';
import { documentChannel } from '@/class/singleton/channels';
import { documentsRequiredStore as documentsRequiredStoreModule } from '@/store';
import Answer from '@/class/Answer';
import { DOC_STATUSES } from '@/constants';
import documentsService from '@/service/documents';

const { ERRORS } = ConnectError;

const PRIORITY = {
  [DOC_STATUSES.VERIFIED]: 1,
  [DOC_STATUSES.PENDING_REVIEW]: 2,
  [DOC_STATUSES.NOT_VERIFIED]: 3,
  [DOC_STATUSES.NOT_READABLE]: 4,
  [DOC_STATUSES.DRAFT]: 5,
  [DOC_STATUSES.RECOGNITION]: 6,
};

const BAD_STATUSES = [
  DOC_STATUSES.RECOGNITION,
  DOC_STATUSES.DRAFT,
  DOC_STATUSES.NOT_READABLE,
  DOC_STATUSES.NOT_VERIFIED,
];

@Module({ generateMutationSetters: true })
class DocumentRequiredController extends VuexModule {
  documentsList = [];

  docTypeToStatus = {};

  constructor(
    props,
    { documentsRequiredStore = documentsRequiredStoreModule },
  ) {
    super(props);
    this.documentsRequiredStore = documentsRequiredStore;
  }

  get docRequiredTypes() {
    return this.documentsRequiredStore.docRequiredTypes;
  }

  get isRequiredVerified() {
    return this.docRequiredTypes.every(type => {
      const status = this.docTypeToStatus[type];
      return status === DOC_STATUSES.VERIFIED;
    });
  }

  get isHaveBad() {
    return Object.values(this.docTypeToStatus).every(
      status => !BAD_STATUSES.includes(status),
    );
  }

  getDocTypeToStatus(documentsList) {
    return documentsList.reduce((statusMap, document) => {
      const { documentType, status } = document;
      if (!this.docRequiredTypes.includes(documentType)) {
        return statusMap;
      }
      const currentStatus = statusMap[documentType];
      if (PRIORITY[status] < PRIORITY[currentStatus]) {
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
    this.docTypeToStatus = this.getDocTypeToStatus(items);
  }

  @Action
  cancelCreate() {
    const result = Answer.createFail(ERRORS.CREATE_DOCUMENT);
    documentChannel.put(result);
  }

  @Action
  finishCreate() {
    const result = Answer.createOk();
    documentChannel.put(result);
  }
}

export default () => createController(DocumentRequiredController);
