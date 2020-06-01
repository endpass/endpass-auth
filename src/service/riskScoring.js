import {
  getIP,
  getFingerprint,
  getTimezone,
  encryptMetric,
} from '@endpass/utils/metrics';
import requestSkipPermission from '@/class/singleton/request/requestSkipPermission';
import { METRIC_TYPES } from '@/constants';

/**
 * @returns {Promise<void>}
 */
const sendUserMetrics = async () => {
  const metrics = [];

  try {
    const ip = await getIP();

    metrics.push({
      eventType: METRIC_TYPES.USER_IP_WEBRTC,
      payload: encryptMetric(ip),
    });
  } catch (err) {}

  try {
    const fingerprint = await getFingerprint();

    metrics.push({
      eventType: METRIC_TYPES.USER_BROWSER_FINGERPRINT,
      payload: encryptMetric(fingerprint),
    });
  } catch (err) {}

  try {
    const timezone = getTimezone();

    metrics.push({
      eventType: METRIC_TYPES.USER_BROWSER_TIMEZONE,
      payload: encryptMetric(timezone),
    });
  } catch (err) {}

  return requestSkipPermission.post(
    `${ENV.VUE_APP_IDENTITY_API_URL}/user/metric`,
    metrics,
  );
};

export default {
  sendUserMetrics,
};
