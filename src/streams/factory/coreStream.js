import { METHODS } from '@/constants';
import authService from '@/service/auth';
import subscribe from '@/streams/subscribe';
import withPayloadHandler from '../middleware/withPayloadHandler';
import answerToRequest from '../middleware/answerToRequest';

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
