import GasPriceModule from '@/store/modules/GasPriceModule';
import SharedModule from '@/store/modules/SharedModule';
import ChannelStore from '@/store/modules/ChannelModule';
import BalanceModule from '@/store/modules/BalanceModule';
import AccountsModule from '@/store/modules/AccountsModule';
import AuthModule from '@/store/modules/AuthModule';
import CoreModule from '@/store/modules/CoreModule';
import RequestsModule from '@/store/modules/RequestsModule';
import moduleFactory from '@/store/moduleFactory';

export default store => {
  const createModule = moduleFactory(store);

  const gasPriceStore = createModule(GasPriceModule, 'gasPrice');

  const sharedStore = createModule(SharedModule, 'shared');

  const channelStore = createModule(ChannelStore, 'channel');

  const balanceStore = createModule(BalanceModule, 'balance');

  const accountsStore = createModule(AccountsModule, 'accounts', {
    sharedStore,
    balanceStore,
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
    channelStore,
    gasPriceStore,
    sharedStore,
    accountsStore,
    balanceStore,
    authStore,
    coreStore,
    requestStore,
  };
};
