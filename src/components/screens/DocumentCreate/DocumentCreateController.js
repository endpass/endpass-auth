// @ts-check
import { VuexModule, Action, Module } from 'vuex-class-modules';
import ConnectError from '@endpass/connect/ConnectError';
import createController from '@/controllers/createController';
import { documentChannel } from '@/class/singleton/channels';

import Answer from '@/class/Answer';

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
      throw new Error('Not defined Document Id');
    }
    const result = Answer.createOk({ id: documentId });
    documentChannel.put(result);
  }
}

export default () => createController(DocumentCreateController);
