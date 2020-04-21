import { VuexModule, Action, Module } from 'vuex-class-modules';
import ConnectError from '@endpass/connect/error';
import createController from '@/controllers/createController';
import { documentChannel } from '@/class/singleton/channels';
import { documentsRequiredStore as documentsRequiredStoreModule } from '@/store';
import Answer from '@/class/Answer';
import eventsService from '@/service/events';
import { NOTIFY_SERVER } from '@/constants';

const { ERRORS } = ConnectError;

@Module({ generateMutationSetters: true })
class DocRequiredCreationController extends VuexModule {
  eventsIterator = null;

  /**
   * @param {import('vuex-class-modules').RegisterOptions} props
   * @param {object} params
   * @param {DocumentsRequiredModule} [params.documentsRequiredStore]
   */
  constructor(
    props,
    { documentsRequiredStore = documentsRequiredStoreModule },
  ) {
    super(props);
    this.documentsRequiredStore = documentsRequiredStore;
  }

  @Action
  async subscribeToUpdateStatus() {
    const events = [NOTIFY_SERVER.USER_DOCUMENT_STATUS_UPDATED];
    this.eventsIterator = eventsService.getUserEventsIterator();

    for await (const { eventType, payload } of this.eventsIterator) {
      if (events.includes(eventType)) {
        const { documentType, status } = payload;
        await this.documentsRequiredStore.changeDocTypeStatus({
          documentType,
          status,
        });
      }
    }
  }

  @Action
  unsubscribeFromUpdateStatus() {
    if (!this.eventsIterator) {
      return;
    }
    this.eventsIterator.return();
    this.eventsIterator = null;
  }

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
