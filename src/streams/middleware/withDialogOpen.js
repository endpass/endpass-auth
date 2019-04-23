import router from '@/router';
import { initDialogResizeStream } from '../dialogResize';

export default async function withDialogOpen(options) {
  if (options.routeName !== undefined) {
    router.replace(`/${options.routeName}`);
    initDialogResizeStream();
  }
}
