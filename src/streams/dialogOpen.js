import bridgeMessenger from '@/class/singleton/messengers';
import { METHODS } from '@/constants';
import router from '@/router';

const onComplete = () => {
  bridgeMessenger.send(METHODS.DIALOG_OPEN);
};

export default function dialogOpen(path) {
  if (path !== undefined) {
    router.replace(`/${path}`, onComplete, onComplete);
  } else {
    router.replace('/bridge');
  }
}
