import { METHODS } from '@/constants';
import permissionsService from '@/service/permissions';
import withPayloadHandler from '@/streams/middleware/withPayloadHandler';
import answerToRequest from '@/streams/middleware/answerToRequest';
import subscribe from '@/streams/subscribe';
import { documentsRequiredStore } from '@/store';

function initDialogRequestStream() {
  const methodToOptions = {
    [METHODS.EXCHANGE_TOKEN_REQUEST]: {
      async payloadHandler(fields) {
        const res = await permissionsService.exchangeCodeToToken(fields);
        return res;
      },
    },

    [METHODS.CHECK_DOCUMENTS_REQUIRED]: {
      async payloadHandler({ clientId }) {
        const res = await documentsRequiredStore.checkRequired({
          clientId,
        });
        return res;
      },
    },
  };

  subscribe(methodToOptions, [withPayloadHandler, answerToRequest]);
}

export default initDialogRequestStream;
