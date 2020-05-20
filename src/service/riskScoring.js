import Fingerprint from 'fingerprintjs2';
import request from '@/class/singleton/request';

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
    const json = entries.reduce((accumulator, entry) => {
      return Object.assign(accumulator, {
        [entry.key]: entry.value,
      });
    }, {});

    await request.post(`${ENV.VUE_APP_IDENTITY_API_URL}/fingerprint`, {
      fingerprint: btoa(JSON.stringify(json)),
    });
  });
};

export default {
  sendFingerprint,
};
