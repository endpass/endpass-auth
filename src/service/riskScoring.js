import Fingerprint from 'fingerprintjs2';
import requestSkipPermission from '@/class/singleton/request/requestSkipPermission';
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

  await requestSkipPermission.post(
    `${ENV.VUE_APP_IDENTITY_API_URL}/user/metric`,
    [
      {
        payload: btoa(unescape(encodeURIComponent(JSON.stringify(json)))),
        eventType: METRIC_TYPES.USER_BROWSER_FINGERPRINT,
      },
    ],
  );
};

export default {
  sendFingerprint,
};
