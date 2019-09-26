// @ts-check
import createStore from '@/store/createStore';
import registerStores from '@/store/registerStores';
import createStoreModule from '@/store/createStoreModule';
import GasPriceModule from '@/store/modules/GasPriceModule';
import AccountsModule from '@/store/modules/AccountsModule';
import CoreModule from '@/store/modules/CoreModule';
import SharedModule from '@/store/modules/SharedModule';
import RequestsModule from '@/store/modules/RequestsModule';

const store = createStore();

/**
 * Create vuex class module registered in the store
 * @template T
 * @param {
    new (
      options: import('vuex-class-modules').RegisterOptions,
      params: { [key: string]: import('vuex-class-modules').VuexModule }
    ) => T
  } Module Vuex class module
 * @param {string} name Module name
 * @param {object=} [params] params for Module
 */
const createModule = (Module, name, params) =>
  createStoreModule(store, Module, name, params);

// old way
registerStores(store);

export const gasPriceStore = createModule(GasPriceModule, 'gasPrice');

export const sharedStore = createModule(SharedModule, 'shared');

export const accountsStore = createModule(AccountsModule, 'accounts', {
  sharedStore,
});

export const coreStore = createModule(CoreModule, 'core', {
  accountsStore,
  sharedStore,
});

export const requestStore = createModule(RequestsModule, 'requests', {
  accountsStore,
  sharedStore,
});

export default store;
