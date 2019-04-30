import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { METHODS } from '@/constants';
import identityService from '@/service/identity';
import withPayloadHandler from './middleware/withPayloadHandler';
import answerToRequest from './middleware/answerToRequest';
import Queue from './Queue';

function initCoreStream() {
  const queueInst = new Queue({
    middleware: [withPayloadHandler, answerToRequest],
  });

  const methodToOptions = {
    [METHODS.LOGOUT]: {
      async payloadHandler() {
        const res = await identityService.logout();

        return res;
      },
    },
  };

  bridgeMessenger.subscribe(async (payload, req) => {
    // routing by methods
    const { method } = req;

    const options = methodToOptions[method] || {};

    queueInst.handleRequest(options, payload, req);
  });
}

export default initCoreStream;
