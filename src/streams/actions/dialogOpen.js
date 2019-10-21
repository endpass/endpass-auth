import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { METHODS } from '@/constants';
import router from '@/router';

export const sendOpen = () => {
  bridgeMessenger.send(METHODS.DIALOG_OPEN);
};

export default function dialogOpen(path) {
  if (path !== undefined) {
    router.replace(`/${path}`, sendOpen, sendOpen);
  } else {
    router.replace('/bridge');
  }
}
