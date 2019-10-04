import { METHODS } from '@/constants';
import identityService from '@/service/identity';
import withPayloadHandler from '../middleware/withPayloadHandler';
import answerToRequest from '../middleware/answerToRequest';
import subscribe from '@/streams/subscribe';

function initCoreStream() {
  const methodToOptions = {
    [METHODS.LOGOUT]: {
      async payloadHandler() {
        const res = await identityService.logout();

        return res;
      },
    },
  };

  subscribe(methodToOptions, [withPayloadHandler, answerToRequest]);
}

export default initCoreStream;
