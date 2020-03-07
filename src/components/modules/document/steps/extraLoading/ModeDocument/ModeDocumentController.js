// @ts-check
import { VuexModule, Action, Module } from 'vuex-class-modules';
import createController from '@/controllers/createController';

import documentsService from '@/service/documents';

@Module({ generateMutationSetters: true })
class ModeDocumentController extends VuexModule {
  /**
   *
   * @param {string} docId
   * @return {Promise<void>}
   */
  @Action
  async waitDocumentStatus(docId) {
    await documentsService.waitDocumentVerified(docId);
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

export default () => createController(ModeDocumentController);
