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
 * @returns {{
 *   timezone: string,
 *   gmt: number|string,
 * }}
 */
const getUserTimezone = () => {
  const dateParts = new Date().toString().split(' ');
  const timezoneType = dateParts[dateParts.length - 2];
  const timezoneOffset = dateParts[dateParts.length - 1];

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const gmt = `${timezoneType} ${timezoneOffset}`;

  return {
    timezone,
    gmt,
  };
};

/**
 * @param {object[]} entries
 * @returns {void}
 */
const sendUserMetrics = async () => {
  const json = await getFingerprintJsonData();
  const timezoneData = getUserTimezone();

  await requestSkipPermission.post(
    `${ENV.VUE_APP_IDENTITY_API_URL}/user/metric`,
    [
      {
        payload: btoa(unescape(encodeURIComponent(JSON.stringify(json)))),
        eventType: METRIC_TYPES.USER_BROWSER_FINGERPRINT,
      },
      {
        payload: btoa(
          unescape(encodeURIComponent(JSON.stringify(timezoneData))),
        ),
        eventType: METRIC_TYPES.USER_BROWSER_TIMEZONE,
      },
    ],
  );
};

export default {
  sendUserMetrics,
};
