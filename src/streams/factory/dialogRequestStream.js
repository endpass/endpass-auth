import { METHODS } from '@/constants';
import permissionsService from '@/service/permissions';
import withPayloadHandler from '@/streams/middleware/withPayloadHandler';
import answerToRequest from '@/streams/middleware/answerToRequest';
import subscribe from '@/streams/subscribe';

function initDialogRequestStream() {
  const methodToOptions = {
    [METHODS.EXCHANGE_TOKEN_REQUEST]: {
      async payloadHandler(fields) {
        const res = await permissionsService.exchangeCodeToToken(fields);
        return res;
      },
    },
  };

  subscribe(methodToOptions, [withPayloadHandler, answerToRequest]);
}

export default initDialogRequestStream;
