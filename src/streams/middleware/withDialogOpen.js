import router from '@/router';
import { initDialogResize } from '@/streams/Actions/dialogResize';

export default async function withDialogOpen(options) {
  if (options.routeName !== undefined) {
    router.replace(`/${options.routeName}`);
    initDialogResize();
  }
}
