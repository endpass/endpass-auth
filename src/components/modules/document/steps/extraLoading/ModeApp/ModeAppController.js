// @ts-check
import { VuexModule, Action, Module } from 'vuex-class-modules';
import createController from '@/controllers/createController';

import documentsService from '@/service/documents';
import { DOC_STATUSES } from '@/constants';

@Module({ generateMutationSetters: true })
class ModeAppController extends VuexModule {
  /**
   *
   * @param {string} docId
   * @return {Promise<void>}
   */
  @Action
  async waitDocumentStatus(docId) {
    await documentsService.waitDocumentStatus({
      id: docId,
      waitingStatuses: [DOC_STATUSES.VERIFIED],
      timeoutMS: 30000, // 30 seconds
    });
  }

  /**
   * @param {string} docId
   * @return {Promise<*>}
   */
  @Action
  async getDocumentStatus(docId) {
    return documentsService.getDocumentStatus(docId);
  }
}

export default () => createController(ModeAppController);
