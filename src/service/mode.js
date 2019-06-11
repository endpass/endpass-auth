import isEmpty from 'lodash/isEmpty';
import http from '@/class/singleton/http';

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
        throw new Error(
          'You are not logged in at your identity server. Please log in with your identity provider, come back to this page, and try again.',
        );

      default:
        throw new Error(
          'The URL you have entered does not point to a valid identity server. Please double check the address and try again.',
        );
    }
  }
};

export default {
  validateIdentityServer,
};
