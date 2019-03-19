import { CrossWindowMessenger } from '@endpass/class';
import { DIRECTION } from '@/constants';

const bridgeMessenger = new CrossWindowMessenger({
  // showLogs: !ENV.isProduction,
  name: 'auth-bridge',
  target: window.parent,
  from: DIRECTION.AUTH,
  to: DIRECTION.CONNECT,
});

export default bridgeMessenger;
