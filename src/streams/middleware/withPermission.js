import store from '@/store';
import dialogOpen from '../dialogOpen';
import { permissionChannel } from '@/class/singleton/channels';

export default async function withPermission(options, action) {
  if (!options.needPermission) {
    return;
  }

  if (store.getters.demoData) {
    return;
  }

  const status = await store.dispatch('getAuthStatus');

  if (status !== 403) {
    return;
  }

  dialogOpen('permission');
  const res = await permissionChannel.take();
  if (res.status === false) {
    action.end();
  }
}
