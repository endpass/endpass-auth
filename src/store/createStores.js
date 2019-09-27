import GasPriceModule from '@/store/modules/GasPriceModule';
import SharedModule from '@/store/modules/SharedModule';
import AccountsModule from '@/store/modules/AccountsModule';
import CoreModule from '@/store/modules/CoreModule';
import RequestsModule from '@/store/modules/RequestsModule';
import createStoreModule from '@/store/createStoreModule';

export default store => {
  const createModule = createStoreModule(store);

  const gasPriceStore = createModule(GasPriceModule, 'gasPrice');

  const sharedStore = createModule(SharedModule, 'shared');

  const accountsStore = createModule(AccountsModule, 'accounts', {
    sharedStore,
  });

  const coreStore = createModule(CoreModule, 'core', {
    accountsStore,
    sharedStore,
  });

  const requestStore = createModule(RequestsModule, 'requests', {
    accountsStore,
    sharedStore,
  });

  return {
    gasPriceStore,
    sharedStore,
    accountsStore,
    coreStore,
    requestStore,
  }
}
