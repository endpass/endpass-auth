import { VuexModule, Action, Module } from 'vuex-class-modules';
import ConnectError from '@endpass/connect/error';
import createController from '@/controllers/createController';
import { documentChannel } from '@/class/singleton/channels';

import Answer from '@/class/Answer';
// import documentsService from '@/service/documents';

const { ERRORS } = ConnectError;

@Module({ generateMutationSetters: true })
class DocumentCreateController extends VuexModule {
  @Action
  cancelCreate() {
    const result = Answer.createFail(ERRORS.CREATE_DOCUMENT);
    documentChannel.put(result);
  }

  /**
   * @param {string?} documentId
   */
  @Action
  finishCreate(documentId) {
    if (!documentId) {
      throw new Error('Not defined document Id');
    }
    const result = Answer.createOk({ id: documentId });
    documentChannel.put(result);
  }

  @Action
  finishRequest() {
    const result = Answer.createOk();
    documentChannel.put(result);
  }

  // @Action
  // async getStatuses(clientId) {
  // const [requiredTypes, documentsList] = await new Promise.all([
  //   documentsService.getRequiredDocumentsTypes(clientId),
  //   documentsService.getDocumentsList(),
  // ];
  //

  // const onlyRequiredDocs = documentsList.reduce((statusMap, document) => {
  //   const { documentType, status } = document;
  //   if (!requiredTypes.includes(documentType)) {
  //     return statusMap;
  //   }
  //   return [
  //     ...statusMap
  //       [documentType]: statusMap,
  // ];
  // }, {});

  // }
}

export default () => createController(DocumentCreateController);
