import { VuexModule, Action, Module } from 'vuex-class-modules';
import ConnectError from '@endpass/connect/error';
import createController from '@/controllers/createController';
import { documentChannel } from '@/class/singleton/channels';

import Answer from '@/class/Answer';

const { ERRORS } = ConnectError;

// TODO: rename DocumentSingleController
@Module({ generateMutationSetters: true })
class DocumentSingleController extends VuexModule {
  @Action
  cancelCreate() {
    const result = Answer.createFail(ERRORS.CREATE_DOCUMENT);
    documentChannel.put(result);
  }

  /**
   * @param {object} params
   * @param {string?} params.documentId
   */
  @Action
  finishCreate({ documentId }) {
    if (!documentId) {
      // TODO: check error processing
      throw new Error('Not defined document Id');
    }
    const result = Answer.createOk({ id: documentId });
    documentChannel.put(result);
  }
}

// @ts-ignore
export default () => createController(DocumentSingleController);
