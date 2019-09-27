import { accountsStore } from '@/store';
import dialogOpen from '@/streams/Actions/dialogOpen';
import { permissionChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';

export default async function withPermission(options, action) {
  if (!options.needPermission) {
    return;
  }

  await accountsStore.defineAuthStatus();

  const { isPermission, isLogin } = accountsStore;

  if (isPermission || !isLogin) {
    permissionChannel.put(Answer.createOk());
    return;
  }

  dialogOpen('permission');
  const res = await permissionChannel.take();
  if (res.status === false) {
    action.end();
    action.req.answer(res);
  }
}
