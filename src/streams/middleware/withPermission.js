import store from '@/store';
import dialogOpen from '@/streams/Actions/dialogOpen';
import { permissionChannel } from '@/class/singleton/channels';
import { Answer } from '@/class';

export default async function withPermission(options, action) {
  if (!options.needPermission) {
    return;
  }

  if (store.getters.demoData) {
    return;
  }

  await store.dispatch('defineAuthStatus');

  const { isPermission, isLogin } = store.state.accounts;

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
