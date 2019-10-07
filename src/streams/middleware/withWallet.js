import { accountsStore } from '@/store';
import dialogOpen from '@/streams/actions/dialogOpen';
import { walletChannel } from '@/class/singleton/channels';

export default async function withWallet(options, action) {
  if (!options.needWallet) {
    return;
  }

  try {
    const isExist = await accountsStore.checkAccountExists();
    if (isExist) {
      return;
    }
  } catch (e) {
    dialogOpen('wallet-exist-check');
    const checkRes = await walletChannel.take();

    if (checkRes.status === false) {
      action.end();
      action.req.answer(checkRes);
      return;
    }

    if (checkRes.payload.isExist === true) {
      return;
    }
  }

  dialogOpen('wallet-create');
  const res = await walletChannel.take();
  if (res.status === false) {
    action.end();
    action.req.answer(res);
  }
}
