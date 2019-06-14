import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { METHODS } from '@/constants';
import permissionsService from '@/service/permissions';
import withPayloadHandler from '@/streams/middleware/withPayloadHandler';
import answerToRequest from '@/streams/middleware/answerToRequest';
import Queue from '@/streams/Queue';

function initDialogRequestStream() {
  const queueInst = new Queue({
    middleware: [withPayloadHandler, answerToRequest],
  });

  const methodToOptions = {
    [METHODS.EXCHANGE_TOKEN_REQUEST]: {
      async payloadHandler(fields) {
        const res = await permissionsService.exchangeCodeToToken(fields);
        return res;
      },
    },
  };

  bridgeMessenger.subscribe(async (payload, req) => {
    const options = methodToOptions[req.method] || {};

    queueInst.handleRequest(options, payload, req);
  });
}

export default initDialogRequestStream;
