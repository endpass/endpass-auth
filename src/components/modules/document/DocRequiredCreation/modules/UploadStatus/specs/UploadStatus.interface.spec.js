import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { document } from '@unitFixtures/documents';
import UploadStatusInterface from '../UploadStatus.interface';
import UploadStatusInteractor from '../UploadStatus.interactor';
import setupI18n from '@/locales/i18nSetup';
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';

const localVue = createLocalVue();
localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('UploadStatusInterface', () => {
  let bootstrap;
  const clientId = 'clientId';

  const defaultProps = {
    isAvailableToFinish: true,
    isAllDocRequiredTypesVerified: true,
  };

  const createBootstrap = async options => {
    const store = createStore();
    const {
      documentsRequiredStore: documentsRequiredStoreModule,
    } = createStoreModules(store);

    const documentsRequiredStore = documentsRequiredStoreModule;
    await documentsRequiredStore.checkRequired({
      clientId,
      documentsList: [document],
    });
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
      it('should emit finish', async () => {
        expect.assertions(2);

        const { wrapper } = bootstrap;

        expect(wrapper.emitted().finish).toBeUndefined();

        wrapper.find(UploadStatusInteractor).vm.$emit('finish');
        await global.flushPromises();

        expect(wrapper.emitted().finish).toEqual([[]]);
      });
    });

    describe('client id', () => {
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
          documentsList: [],
        });

        expect(
          bootstrap.wrapper.find(UploadStatusInteractor).props().clientId,
        ).toBe(otherClientId);
      });
    });
  });
});
