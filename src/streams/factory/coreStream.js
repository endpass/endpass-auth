import { METHODS } from '@/constants';
import authService from '@/service/auth';
import withPayloadHandler from '../middleware/withPayloadHandler';
import answerToRequest from '../middleware/answerToRequest';
import subscribe from '@/streams/subscribe';

function initCoreStream() {
  const methodToOptions = {
    [METHODS.LOGOUT]: {
      async payloadHandler() {
        const res = await authService.logout();

        return res;
      },
    },
  };

  subscribe(methodToOptions, [withPayloadHandler, answerToRequest]);
}

export default initCoreStream;
