import CrossWindowMessenger from '@endpass/class/CrossWindowMessenger';
import { DIRECTION } from '@/constants';

const bridgeMessenger = new CrossWindowMessenger({
  // showLogs: !ENV.VUE_APP_IS_PRODUCTION,
  name: 'auth-bridge',
  target: window.parent,
  from: DIRECTION.AUTH,
  to: DIRECTION.CONNECT,
});

export default bridgeMessenger;
