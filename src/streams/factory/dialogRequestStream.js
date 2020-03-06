import { METHODS } from '@/constants';
import permissionsService from '@/service/permissions';
import withPayloadHandler from '@/streams/middleware/withPayloadHandler';
import answerToRequest from '@/streams/middleware/answerToRequest';
import subscribe from '@/streams/subscribe';
// import documentsService from '@/service/documents';

function initDialogRequestStream() {
  const methodToOptions = {
    [METHODS.EXCHANGE_TOKEN_REQUEST]: {
      async payloadHandler(fields) {
        const res = await permissionsService.exchangeCodeToToken(fields);
        return res;
      },
    },

    // [METHODS.CHECK_DOCUMENTS_REQUIRED]: {
    //   async payloadHandler({ clientId, documentList }) {
    // check doc req list
    // cache them
    // if all ok, return 'success'
    // if error, return error
    // return documentsRequiredStore.checkRequired({ clientId, documentList });

    // move this to documentsRequiredStore
    // if (documentsRequiredStore.check) {
    //   return cache;
    // }
    // const res = await documentsService.getRequiredDocumentsTypes({ clientId });
    // cache = res;
    // return res;
    // },
    // },
  };

  subscribe(methodToOptions, [withPayloadHandler, answerToRequest]);
}

export default initDialogRequestStream;
