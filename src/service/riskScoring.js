import getFingerprint from '@endpass/utils/metricsFingerprint';
import getTimezone from '@endpass/utils/metricsTimezone';
import encryptMetric from '@endpass/utils/metricsEncrypt';
import requestSkipPermission from '@/class/singleton/request/requestSkipPermission';
import { METRIC_TYPES } from '@/constants';

/**
 * @param {object[]} entries
 * @returns {void}
 */
const sendUserMetrics = async () => {
  const fingerprint = await getFingerprint();
  const timezone = getTimezone();

  return requestSkipPermission.post(
    `${ENV.VUE_APP_IDENTITY_API_URL}/user/metric`,
    [
      {
        payload: encryptMetric(fingerprint),
        eventType: METRIC_TYPES.USER_BROWSER_FINGERPRINT,
      },
      {
        payload: encryptMetric(timezone),
        eventType: METRIC_TYPES.USER_BROWSER_TIMEZONE,
      },
    ],
  );
};

export default {
  sendUserMetrics,
};
