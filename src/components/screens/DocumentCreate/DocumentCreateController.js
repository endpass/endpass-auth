// @ts-check
import { VuexModule, Action, Module } from 'vuex-class-modules';
import ConnectError from '@endpass/connect/ConnectError';
import createController from '@/controllers/createController';
import { documentChannel } from '@/class/singleton/channels';

import Answer from '@/class/Answer';

const { ERRORS } = ConnectError;

@Module({ generateMutationSetters: true })
class DocumentCreateController extends VuexModule {
  /**
   *
   * @param {string?} documentId
   */
  @Action
  finishCreate(documentId) {
    const result = documentId
      ? Answer.createOk({
          id: documentId,
        })
      : Answer.createFail(ERRORS.CREATE_DOCUMENT);

    documentChannel.put(result);
  }
}

export default () => createController(DocumentCreateController);
