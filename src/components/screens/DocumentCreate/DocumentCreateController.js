// @ts-check
import { VuexModule, Action, Module } from 'vuex-class-modules';
// @ts-ignore
import ConnectError from '@endpass/class/ConnectError';
import createController from '@/controllers/createController';
import { documentChannel } from '@/class/singleton/channels';

import Answer from '@/class/Answer';

const { ERRORS } = ConnectError;

@Module({ generateMutationSetters: true })
class DocumentCreateController extends VuexModule {
  /**
   *
   * @param {boolean} isUploaded
   */
  @Action
  finishCreate(isUploaded) {
    const result = isUploaded
      ? Answer.createOk()
      : Answer.createFail(ERRORS.CREATE_DOCUMENT);

    documentChannel.put(result);
  }
}

export default () => createController(DocumentCreateController);
