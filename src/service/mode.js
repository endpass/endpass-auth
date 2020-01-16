import isEmpty from 'lodash/isEmpty';
import http from '@/class/singleton/request/http';
import i18n from '@/locales/i18n';

export const validateIdentityServer = async serverUrl => {
  const accountsError =
    'Your identity server does not have any accounts. Please add some accounts with your identity provider and reload this page.';

  try {
    const { data: accounts } = await http.get(`${serverUrl}/accounts`, {
      withCredentials: true,
    });

    if (isEmpty(accounts)) {
      throw new Error(accountsError);
    }

    return true;
  } catch (e) {
    if (e.message === accountsError) {
      throw e;
    }

    const respCode = e.response && e.response.status;

    switch (respCode) {
      case 401:
        throw new Error(i18n.t('services.mode.notLogged'));

      default:
        throw new Error(i18n.t('services.mode.serverInvalid'));
    }
  }
};

export default {
  validateIdentityServer,
};
