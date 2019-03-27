import bridgeMessenger from '@/class/singleton/messengers';
import { METHODS } from '@/constants';

export default function() {
  bridgeMessenger.send(METHODS.DIALOG_CLOSE);
}
