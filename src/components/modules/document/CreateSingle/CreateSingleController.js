import { VuexModule, Action, Module } from 'vuex-class-modules';
import ConnectError from '@endpass/connect/error';
import createController from '@/controllers/createController';
import { documentChannel } from '@/class/singleton/channels';

import Answer from '@/class/Answer';
import { channelStore as channelStoreModule } from '@/store';

const { ERRORS } = ConnectError;

/**
 * @typedef { import("@/store/modules/channelModule").default } channelModule
 */

@Module({ generateMutationSetters: true })
class CreateSingleController extends VuexModule {
  /**
   *
   * @param {import('vuex-class-modules').RegisterOptions} props
   * @param {object} params
   * @param {{channelStore?: channelModule}} params.channelStore
   */
  constructor(props, { channelStore = channelStoreModule }) {
    super(props);
    this.channelStore = channelStore;
  }

  /**
   *
   * @return {*|"DriverLicense"|string|string}
   */
  get defaultDocumentType() {
    return this.channelStore.payload.defaultDocumentType || '';
  }

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
      // TODO: check error processing
      throw new Error('Not defined document Id');
    }
    const result = Answer.createOk({ id: documentId });
    documentChannel.put(result);
  }
}

// @ts-ignore
export default () => createController(CreateSingleController);
