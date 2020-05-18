import request from '@/class/singleton/request';

/**
 * @param {object[]} entries
 * @returns {Promise<void>}
 */
const sendFingerprint = entries => {
  const json = {};

  entries.forEach(entry => {
    json[entry.key] = entry.value;
  });

  const fingerprint = Buffer.from(JSON.stringify(json)).toString('base64');

  return request.post(`${ENV.VUE_APP_IDENTITY_API_URL}/fingerprint`, {
    fingerprint,
  });
};

export default {
  sendFingerprint,
};
