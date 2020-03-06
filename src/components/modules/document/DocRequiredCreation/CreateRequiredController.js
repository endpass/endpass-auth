import { VuexModule, Action, Module } from 'vuex-class-modules';
import ConnectError from '@endpass/connect/error';
import createController from '@/controllers/createController';
import { documentChannel } from '@/class/singleton/channels';
import { channelStore as channelStoreModule } from '@/store';

import Answer from '@/class/Answer';
// import documentsService from '@/service/documents';
import { DOC_STATUSES } from '@/constants';

const { ERRORS } = ConnectError;

const PRIORITY = {
  [DOC_STATUSES.VERIFIED]: 1,
  [DOC_STATUSES.PENDING_REVIEW]: 2,
  [DOC_STATUSES.NOT_VERIFIED]: 3,
  [DOC_STATUSES.NOT_READABLE]: 4,
  [DOC_STATUSES.DRAFT]: 5,
  [DOC_STATUSES.RECOGNITION]: 6,
};

@Module({ generateMutationSetters: true })
class CreateRequiredController extends VuexModule {
  constructor(props, { channelStore = channelStoreModule }) {
    super(props);
    this.channelStore = channelStore;
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

  getTypeToStatus(requiredTypes, documentsList) {
    return documentsList.reduce((statusMap, document) => {
      const { documentType, status } = document;
      if (!requiredTypes.includes(documentType)) {
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
  async getRequiredTypes() {
    // const { requiredTypes, documentsList } = documentsRequiredStore;
    // TODO: move getTypeToStatus to documentsRequiredStore
    // const [requiredTypes, documentsListDetails] = await Promise.all([
    //   documentsService.getRequiredDocumentsTypes(clientId),
    //   documentsService.getDocumentsList(),
    // ]);
    // const { items: documentsList } = documentsListDetails;
    // const typeToStatus = this.getTypeToStatus(requiredTypes, documentsList);
    //
    // return {
    //   types: requiredTypes,
    //   typeToStatus,
    // };
  }
}

export default () => createController(CreateRequiredController);
