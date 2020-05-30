import getFingerprint from '@endpass/utils/metricsFingerprint';
import encryptMetric from '@endpass/utils/metricsEncrypt';
import requestSkipPermission from '@/class/singleton/request/requestSkipPermission';
import { METRIC_TYPES } from '@/constants';

/**
 * @param {object[]} entries
 * @returns {void}
 */
const sendUserMetrics = async () => {
  const fingerprint = await getFingerprint();

  return requestSkipPermission.post(
    `${ENV.VUE_APP_IDENTITY_API_URL}/user/metric`,
    [
      {
        payload: encryptMetric(fingerprint),
        eventType: METRIC_TYPES.USER_BROWSER_FINGERPRINT,
      },
    ],
  );
};

export default {
  sendUserMetrics,
};
