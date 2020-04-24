import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import UploadStatusInterface from '@/components/modules/document/DocRequiredCreation/modules/UploadStatus/UploadStatus.interface';
import setupI18n from '@/locales/i18nSetup';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';
import documentsService from '@/service/documents';
import { DOC_STATUSES, DOC_TYPES } from '@/constants';

const localVue = createLocalVue();
localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('UploadStatusInterface', () => {
  let wrapper;
  let documentsRequiredStore;

  const clientId = 'clientId';

  const GatewayComponent = {
    name: 'GatewayComponent',
    template: '<div>template</div>',
    inject: ['gateway'],
  };

  const createWrapper = options => {
    return shallowMount(UploadStatusInterface, {
      localVue,
      i18n,
      documentsRequiredStore,
      stubs: {
        'upload-status': GatewayComponent,
      },
      ...options,
    });
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const store = createStore();
    const {
      documentsRequiredStore: documentsRequiredStoreModule,
    } = createStoreModules(store);

    documentsRequiredStore = documentsRequiredStoreModule;
    await documentsRequiredStore.checkRequired({ clientId });
    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('UploadStatusInterface');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    describe('gateway api', () => {
      beforeEach(async () => {
        documentsService.getRequiredDocumentsTypes.mockResolvedValueOnce([
          DOC_TYPES.PASSPORT,
        ]);
        await documentsRequiredStore.checkRequired({ clientId });

        documentsService.getDocumentsList.mockResolvedValueOnce({
          items: [],
        });

        await wrapper
          .find(GatewayComponent)
          .vm.gateway.loadDocumentsTypesAndStatuses();
        await global.flushPromises();
      });

      it('should change verified to true', async () => {
        expect.assertions(2);

        expect(
          wrapper.find(GatewayComponent).attributes()['is-statuses-verified'],
        ).toBeFalsy();

        documentsService.getDocumentsList.mockResolvedValueOnce({
          items: [
            { documentType: DOC_TYPES.PASSPORT, status: DOC_STATUSES.VERIFIED },
          ],
        });

        await wrapper
          .find(GatewayComponent)
          .vm.gateway.loadDocumentsTypesAndStatuses();
        await global.flushPromises();

        expect(
          wrapper.find(GatewayComponent).attributes()['is-statuses-verified'],
        ).toBeTruthy();
      });

      it('should change appropriated to true', async () => {
        expect.assertions(2);

        expect(
          wrapper.find(GatewayComponent).attributes()[
            'is-statuses-appropriated'
          ],
        ).toBeFalsy();

        documentsService.getDocumentsList.mockResolvedValueOnce({
          items: [
            {
              documentType: DOC_TYPES.PASSPORT,
              status: DOC_STATUSES.PENDING_REVIEW,
            },
          ],
        });

        await wrapper
          .find(GatewayComponent)
          .vm.gateway.loadDocumentsTypesAndStatuses();
        await global.flushPromises();

        expect(
          wrapper.find(GatewayComponent).attributes()[
            'is-statuses-appropriated'
          ],
        ).toBeTruthy();
      });
    });

    describe('verified statuses', () => {
      it('should return true if all verified', async () => {
        expect.assertions(1);

        documentsService.getDocumentsList.mockResolvedValueOnce({
          items: [
            { documentType: DOC_TYPES.PASSPORT, status: DOC_STATUSES.VERIFIED },
          ],
        });
        documentsService.getRequiredDocumentsTypes.mockResolvedValueOnce([
          DOC_TYPES.PASSPORT,
        ]);

        await documentsRequiredStore.checkRequired({ clientId });

        wrapper = createWrapper();

        await global.flushPromises();

        expect(
          wrapper.find(GatewayComponent).attributes()['is-statuses-verified'],
        ).toBeTruthy();
      });

      it('should return false if not verified', async () => {
        expect.assertions(1);

        documentsService.getDocumentsList.mockResolvedValueOnce({
          items: [
            {
              documentType: DOC_TYPES.PASSPORT,
              status: DOC_STATUSES.PENDING_REVIEW,
            },
          ],
        });
        documentsService.getRequiredDocumentsTypes.mockResolvedValueOnce([
          DOC_TYPES.PASSPORT,
        ]);

        await documentsRequiredStore.checkRequired({ clientId });

        wrapper = createWrapper();

        await global.flushPromises();

        expect(
          wrapper.find(GatewayComponent).attributes()['is-statuses-verified'],
        ).toBeFalsy();
      });

      it('should return true if add new document', async () => {
        expect.assertions(2);

        documentsService.getDocumentsList.mockResolvedValueOnce({
          items: [
            {
              documentType: DOC_TYPES.PASSPORT,
              status: DOC_STATUSES.PENDING_REVIEW,
            },
          ],
        });
        documentsService.getRequiredDocumentsTypes.mockResolvedValueOnce([
          DOC_TYPES.PASSPORT,
        ]);
        await documentsRequiredStore.checkRequired({ clientId });
        wrapper = createWrapper();
        await global.flushPromises();

        expect(
          wrapper.find(GatewayComponent).attributes()['is-statuses-verified'],
        ).toBeFalsy();

        await documentsRequiredStore.addDocTypeStatus({
          documentType: DOC_TYPES.PASSPORT,
          status: DOC_STATUSES.VERIFIED,
        });

        await global.flushPromises();

        expect(
          wrapper.find(GatewayComponent).attributes()['is-statuses-verified'],
        ).toBeTruthy();
      });
    });

    describe('appropriated statuses', () => {
      it('should return true if verified or pending', async () => {
        expect.assertions(1);

        documentsService.getDocumentsList.mockResolvedValueOnce({
          items: [
            { documentType: DOC_TYPES.PASSPORT, status: DOC_STATUSES.VERIFIED },
            {
              documentType: DOC_TYPES.ID_CARD,
              status: DOC_STATUSES.PENDING_REVIEW,
            },
          ],
        });
        documentsService.getRequiredDocumentsTypes.mockResolvedValueOnce([
          DOC_TYPES.PASSPORT,
          DOC_TYPES.ID_CARD,
        ]);

        await documentsRequiredStore.checkRequired({ clientId });

        wrapper = createWrapper();

        await global.flushPromises();

        expect(
          wrapper.find(GatewayComponent).attributes()[
            'is-statuses-appropriated'
          ],
        ).toBeTruthy();
      });

      it('should return false if not appropriated', async () => {
        expect.assertions(1);

        documentsService.getDocumentsList.mockResolvedValueOnce({
          items: [
            {
              documentType: DOC_TYPES.PASSPORT,
              status: DOC_STATUSES.RECOGNITION,
            },
          ],
        });
        documentsService.getRequiredDocumentsTypes.mockResolvedValueOnce([
          DOC_TYPES.PASSPORT,
        ]);

        await documentsRequiredStore.checkRequired({ clientId });

        wrapper = createWrapper();

        await global.flushPromises();

        expect(
          wrapper.find(GatewayComponent).attributes()[
            'is-statuses-appropriated'
          ],
        ).toBeFalsy();
      });
    });

    describe('check upload', () => {
      it('should return for not need upload', async () => {
        expect.assertions(1);

        documentsService.getDocumentsList.mockResolvedValueOnce({
          items: [],
        });
        documentsService.getRequiredDocumentsTypes.mockResolvedValueOnce([]);

        const res = await documentsRequiredStore.checkRequired({ clientId });
        expect(res).toEqual({
          isNeedUploadDocument: false,
        });
      });

      it('should return for need upload', async () => {
        expect.assertions(1);

        documentsService.getRequiredDocumentsTypes.mockResolvedValueOnce([
          DOC_TYPES.PASSPORT,
        ]);

        const res = await documentsRequiredStore.checkRequired({ clientId });
        expect(res).toEqual({
          isNeedUploadDocument: true,
        });
      });

      it('should not upload for verified statuses', async () => {
        expect.assertions(1);

        documentsService.getDocumentsList.mockResolvedValueOnce({
          items: [
            { documentType: DOC_TYPES.PASSPORT, status: DOC_STATUSES.VERIFIED },
          ],
        });
        documentsService.getRequiredDocumentsTypes.mockResolvedValueOnce([
          DOC_TYPES.PASSPORT,
        ]);

        const res = await documentsRequiredStore.checkRequired({ clientId });
        expect(res).toEqual({
          isNeedUploadDocument: false,
        });
      });

      it('should upload for not verified statuses', async () => {
        expect.assertions(1);

        documentsService.getDocumentsList.mockResolvedValueOnce({
          items: [
            {
              documentType: DOC_TYPES.PASSPORT,
              status: DOC_STATUSES.PENDING_REVIEW,
            },
          ],
        });
        documentsService.getRequiredDocumentsTypes.mockResolvedValueOnce([
          DOC_TYPES.PASSPORT,
        ]);

        const res = await documentsRequiredStore.checkRequired({ clientId });
        expect(res).toEqual({
          isNeedUploadDocument: true,
        });
      });
    });
  });
});
