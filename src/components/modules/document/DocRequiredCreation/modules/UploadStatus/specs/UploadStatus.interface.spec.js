import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import UploadStatusInterface from '../UploadStatus.interface';
import UploadStatusInteractor from '../UploadStatus.interactor';
import setupI18n from '@/locales/i18nSetup';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';
import { DOC_STATUSES, DOC_TYPES } from '@/constants';

const localVue = createLocalVue();
localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('UploadStatusInterface', () => {
  let bootstrap;
  const clientId = 'clientId';

  const selectedDocumentsByType = {
    [DOC_TYPES.PROOF_OF_ADDRESS]: {
      status: DOC_STATUSES.PENDING_REVIEW,
    },
  };

  const defaultProps = {
    selectedDocumentType: DOC_TYPES.PROOF_OF_ADDRESS,
    selectedDocumentsByType,
    clientId: 'clientId',
  };

  const createBootstrap = async options => {
    const store = createStore();
    const {
      documentsRequiredStore: documentsRequiredStoreModule,
    } = createStoreModules(store);

    const documentsRequiredStore = documentsRequiredStoreModule;
    await documentsRequiredStore.checkRequired({ clientId });
    const wrapper = shallowMount(UploadStatusInterface, {
      localVue,
      i18n,
      documentsRequiredStore,
      propsData: defaultProps,
      ...options,
    });
    return {
      wrapper,
      documentsRequiredStore,
    };
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    bootstrap = await createBootstrap();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(bootstrap.wrapper.name()).toBe('UploadStatusInterface');
      expect(bootstrap.wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    describe('events', () => {
      it('should emit next', async () => {
        expect.assertions(3);

        const { wrapper } = bootstrap;

        expect(wrapper.emitted().next).toBeUndefined();

        wrapper.find(UploadStatusInteractor).vm.$emit('continue');
        await global.flushPromises();

        expect(wrapper.emitted().next).toHaveLength(1);
        expect(wrapper.emitted().next).toEqual([[]]);
      });
    });

    describe('props', () => {
      it('should pass clientId', async () => {
        expect.assertions(1);

        expect(
          bootstrap.wrapper.find(UploadStatusInteractor).props().clientId,
        ).toBe(clientId);
      });

      it('should pass other clientId', async () => {
        expect.assertions(1);

        const otherClientId = 'otherClientId';

        await bootstrap.documentsRequiredStore.checkRequired({
          clientId: otherClientId,
        });

        expect(
          bootstrap.wrapper.find(UploadStatusInteractor).props().clientId,
        ).toBe(otherClientId);
      });
    });
  });
});
