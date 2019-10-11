import GasPriceModule from '@/store/modules/GasPriceModule';
import SharedModule from '@/store/modules/SharedModule';
import AccountsModule from '@/store/modules/AccountsModule';
import AuthModule from '@/store/modules/AuthModule';
import CoreModule from '@/store/modules/CoreModule';
import RequestsModule from '@/store/modules/RequestsModule';
import moduleFactory from '@/store/moduleFactory';

export default store => {
  const createModule = moduleFactory(store);

  const gasPriceStore = createModule(GasPriceModule, 'gasPrice');

  const sharedStore = createModule(SharedModule, 'shared');

  const accountsStore = createModule(AccountsModule, 'accounts', {
    sharedStore,
  });

  const authStore = createModule(AuthModule, 'auth', {
    sharedStore,
  });

  const coreStore = createModule(CoreModule, 'core', {
    authStore,
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
    authStore,
    coreStore,
    requestStore,
  };
};
