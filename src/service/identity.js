import get from 'lodash/get';
import request from '@/class/singleton/request';
import requestSkipPermission from '@/class/singleton/request/requestSkipPermission';

const identityBaseUrl = ENV.VUE_APP_IDENTITY_API_URL;

const getOtpSettings = () => request.get(`${identityBaseUrl}/settings/otp`);

const checkAccountExist = async () => {
  const list = await requestSkipPermission.get(`${identityBaseUrl}/accounts`);
  const res = list.length !== 0;
  return res;
};

// saveAccount,
//   saveAccountInfo,
//   backupSeed,

const saveAccount = account =>
  requestSkipPermission.post(
    `${identityBaseUrl}/account/${account.address}`,
    account,
  );

const saveAccountInfo = (address, info) =>
  requestSkipPermission.post(
    `${identityBaseUrl}/account/${address}/info`,
    info,
  );

const backupSeed = encryptedSeed =>
  requestSkipPermission.post(`${identityBaseUrl}/user/seed`, {
    seed: encryptedSeed,
  });

const updateAccountSettings = address =>
  requestSkipPermission.post(`${identityBaseUrl}/settings`, {
    lastActiveAccount: address,
  });

/**
 *
 * @param {string?} email
 * @return {Promise<void>}
 */
const resetRegularPassword = async ({ email }) => {
  const { timeout } = await request.post(
    `${identityBaseUrl}/regular-password/reset`,
    {
      email,
    },
  );

  return timeout;
};

const confirmResetRegularPassword = async ({
  password: newPassword,
  code: passwordResetToken,
}) => {
  const { success } = await request.post(
    `${identityBaseUrl}/regular-password/reset/confirm`,
    {
      passwordResetToken,
      newPassword,
    },
  );

  if (!success) throw new Error('Success false');

  return success;
};

/**
 *
 * @param {string?} email
 * @return {Promise<boolean>}
 */
const checkRegularPassword = async email => {
  try {
    await request.post(`${identityBaseUrl}/regular-password/check`, { email });
    return true;
  } catch (error) {
    const isPasswordNotExist = get(error, ['response', 'status']) === 417;

    if (isPasswordNotExist) return false;

    throw error;
  }
};

export default {
  checkAccountExist,
  saveAccount,
  saveAccountInfo,
  backupSeed,
  updateAccountSettings,
  resetRegularPassword,
  confirmResetRegularPassword,
  checkRegularPassword,
  getOtpSettings,
};
