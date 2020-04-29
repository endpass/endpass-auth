import { VuexModule, Action, Module } from 'vuex-class-modules';
import ConnectError from '@endpass/connect/error';
import createController from '@/controllers/createController';
import { documentChannel } from '@/class/singleton/channels';
import { documentsRequiredStore as documentsRequiredStoreModule } from '@/store';
import Answer from '@/class/Answer';
import eventsService from '@/service/events';
import { SERVER_EVENT } from '@/constants';

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
    const events = [SERVER_EVENT.USER_DOCUMENT_STATUS_UPDATED];
    this.eventsIterator = eventsService.getUserEventsIterator();

    for await (const { eventType, payload } of this.eventsIterator) {
      // eslint-disable-next-line no-continue
      if (!events.includes(eventType)) continue;

      const { documentType, status } = payload;
      await this.documentsRequiredStore.addDocTypeStatus({
        documentType,
        status,
      });
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
