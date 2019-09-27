// @ts-check
import createStore from '@/store/createStore';
import widget from './modules/widget';
import createStoreModule from '@/store/createStoreModule';
import GasPriceModule from '@/store/modules/GasPriceModule';
import SharedModule from '@/store/modules/SharedModule';
import AccountsModule from '@/store/modules/AccountsModule';
import CoreModule from '@/store/modules/CoreModule';
import RequestsModule from '@/store/modules/RequestsModule';

const store = createStore();

console.log('store?', store);

// old way
store.registerModule('widget', widget);

// export const {
//   gasPriceStore,
//   sharedStore,
//   accountsStore,
//   coreStore,
//   requestStore,
// } = createStores(store);

const createModule = createStoreModule(store);

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
