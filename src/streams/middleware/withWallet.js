import { accountsStore } from '@/store';
import dialogOpen from '@/streams/Actions/dialogOpen';
import { walletChannel } from '@/class/singleton/channels';

export default async function withWallet(options, action) {
  if (!options.needWallet) {
    return;
  }

  const isExist = await accountsStore.checkAccountExists();
  if (isExist) {
    return;
  }

  dialogOpen('wallet-create');
  const res = await walletChannel.take();
  if (res.status === false) {
    action.end();
    action.req.answer(res);
  }
}
