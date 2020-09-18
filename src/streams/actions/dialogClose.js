import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { METHODS } from '@/constants';
import isDialog from '@/util/isDialog';

export default function () {
  bridgeMessenger.send(METHODS.DIALOG_CLOSE);
  if (!isDialog && window.opener) {
    window.self.opener = window.self;
    window.self.close();
  }
}
