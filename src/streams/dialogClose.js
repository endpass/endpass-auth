import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { METHODS } from '@/constants';

export default function() {
  bridgeMessenger.send(METHODS.DIALOG_CLOSE);
}
