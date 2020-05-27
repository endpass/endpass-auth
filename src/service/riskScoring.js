import Fingerprint from 'fingerprintjs2';
import request from '@/class/singleton/request';
import { METRIC_TYPES } from '@/constants';

/**
 * @param {object[]} entries
 * @returns {void}
 */
const sendFingerprint = () => {
  const finger = new Fingerprint({
    excludeCanvas: true,
  });

  finger.get(async (hash, entries) => {
    /**
     * @type {{
     *   [key: string]: string|number,
     * }}
     */
    const json = entries.reduce(
      (accumulator, entry) => ({
        [entry.key]: entry.value,
        ...accumulator,
      }),
      {},
    );

    await request.post(`${ENV.VUE_APP_IDENTITY_API_URL}/user/metric`, [
      {
        payload: btoa(unescape(encodeURIComponent(JSON.stringify(json)))),
        eventType: METRIC_TYPES.USER_BROWSER_FINGERPRINT,
      },
    ]);
  });
};

export default {
  sendFingerprint,
};
