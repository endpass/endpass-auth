import Fingerprint from 'fingerprintjs2';
import request from '@/class/singleton/request';
import { METRIC_TYPES } from '@/constants';

/**
 * @returns {Promise<{{
 *   [key: string]: string|number,
 * }}>}
 */
const getFingerprintJsonData = () =>
  new Promise(resolve => {
    const finger = new Fingerprint({
      excludeCanvas: true,
    });

    finger.get((hash, entries) =>
      resolve(
        entries.reduce(
          (accumulator, entry) => ({
            [entry.key]: entry.value,
            ...accumulator,
          }),
          {},
        ),
      ),
    );
  });

/**
 * @param {object[]} entries
 * @returns {void}
 */
const sendFingerprint = async () => {
  const json = await getFingerprintJsonData();

  await request.post(`${ENV.VUE_APP_IDENTITY_API_URL}/user/metric`, [
    {
      payload: btoa(unescape(encodeURIComponent(JSON.stringify(json)))),
      eventType: METRIC_TYPES.USER_BROWSER_FINGERPRINT,
    },
  ]);
};

export default {
  sendFingerprint,
};
