// @ts-check
import createStore from '@/store/createStore';
import createStoreModules from '@/store/createStoreModules';
import widget from './modules/widget';

const store = createStore();

// old way
store.registerModule('widget', widget);

export const {
  gasPriceStore,
  sharedStore,
  accountsStore,
  coreStore,
  requestStore,
  authStore,
  balanceStore,
} = createStoreModules(store);

export default store;
