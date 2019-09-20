// @ts-check
import { VuexModule, Action, Module } from 'vuex-class-modules';
import createController from '@/controllers/createController';
import { documentChannel } from '@/class/singleton/channels';

import Answer from '@/class/Answer';

@Module({ generateMutationSetters: true })
class DocumentCreateController extends VuexModule {
  @Action
  finishCreate() {
    documentChannel.put(Answer.createOk());
  }
}

export default () => createController(DocumentCreateController);
