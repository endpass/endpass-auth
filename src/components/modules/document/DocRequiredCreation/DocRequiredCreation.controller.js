import { VuexModule, Action, Module } from 'vuex-class-modules';
import ConnectError from '@endpass/connect/error';
import createController from '@/controllers/createController';
import { documentChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';

const { ERRORS } = ConnectError;

@Module({ generateMutationSetters: true })
class DocRequiredCreationController extends VuexModule {
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
}

export default () => createController(DocRequiredCreationController);
