import router from '@/router';
import { initDialogResize } from '@/streams/Actions/dialogResize';

export default async function withDialogOpen({ routeName }) {
  if (routeName !== undefined) {
    router.replace(`/${routeName}`);
    initDialogResize();
  }
}
