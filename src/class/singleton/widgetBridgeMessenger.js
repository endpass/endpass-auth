import CrossWindowMessenger from '@endpass/class/CrossWindowMessenger';
import { DIRECTION } from '@/constants';

const widgetBridgeMessenger = new CrossWindowMessenger({
  showLogs: !ENV.isProduction,
  name: 'widget-bridge',
  target: window.parent,
  from: DIRECTION.WIDGET,
  to: DIRECTION.CONNECT,
});

export default widgetBridgeMessenger;
