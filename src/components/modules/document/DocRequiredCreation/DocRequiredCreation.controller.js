import { VuexModule, Action, Module } from 'vuex-class-modules';
import createController from '@/controllers/createController';
import { documentsRequiredStore as documentsRequiredStoreModule } from '@/store';
import eventsService from '@/service/events';
import { SERVER_EVENT } from '@/constants';

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

      await this.documentsRequiredStore.addDocTypeStatus(payload);
    }
  }

  @Action
  async unsubscribeFromUpdateStatus() {
    if (!this.eventsIterator) {
      return;
    }
    this.eventsIterator.return();
    this.eventsIterator = null;
  }
}

export default () => createController(DocRequiredCreationController);
