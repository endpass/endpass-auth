import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import Queue from '@/streams/Queue';

export default (methodsMap, middleware) => {
  const queueInst = new Queue({
    middleware,
  });

  bridgeMessenger.subscribe(async (payload, req) => {
    // routing by methods
    const { method } = req;
    const options = methodsMap[method] || {};

    queueInst.handleRequest(options, payload, req);
  });
};
