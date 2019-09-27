// @ts-check
import createStore from '@/store/createStore';
import createStores from '@/store/createStores';
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
} = createStores(store);

export default store;
