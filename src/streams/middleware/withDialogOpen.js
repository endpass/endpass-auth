import router from '@/router';
import dialogResize from '../dialogResize';

export default async function withDialogOpen(options) {
  if (options.routeName !== undefined) {
    router.replace(`/${options.routeName}`);
    dialogResize();
  }
}
