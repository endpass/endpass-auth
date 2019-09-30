import { authStore } from '@/store';
import dialogOpen from '@/streams/Actions/dialogOpen';
import { permissionChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';

export default async function withPermission(options, action) {
  if (!options.needPermission) {
    return;
  }

  await authStore.defineAuthStatus();

  const { isPermission, isLogin } = authStore;

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
