// @ts-check
import createStore from '@/store/createStore';
import registerStores from '@/store/registerStores';
import createStoreModule from '@/store/createStoreModule';
import GasPriceModule from '@/store/modules/GasPriceModule';

const store = createStore();

/**
 * Create vuex class module registered in the store
 * @template T
 * @param {
    new (params: import('vuex-class-modules').RegisterOptions) => T
  } Module Vuex class module
 * @param {string} name Module name
 */
const createModule = (Module, name) => createStoreModule(store, Module, name);

// old way
registerStores(store);

export const gasPriceStore = createModule(GasPriceModule, 'gasPrice');

export default store;
