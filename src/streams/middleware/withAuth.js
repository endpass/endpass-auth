import store from '@/store';
import dialogOpen from '@/streams/Actions/dialogOpen';
import { authChannel } from '@/class/singleton/channels';
import { Answer } from '@/class';

export default async function withAuth(options, action) {
  if (!options.needAuth) {
    return;
  }

  if (store.getters.demoData) {
    return;
  }

  await store.dispatch('defineAuthStatus');

  if (store.state.accounts.isLogin) {
    authChannel.put(Answer.createOk());
    return;
  }

  dialogOpen('auth');
  const res = await authChannel.take();
  if (res.status === false) {
    action.end();
    action.req.answer(res);
  }
}
