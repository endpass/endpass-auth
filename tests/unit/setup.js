import 'jest-localstorage-mock';

import './mocks/service/identity.mock';
import './mocks/service/settings.mock';
import './mocks/service/cryptoData.mock';
import './mocks/service/permissions.mock';
import './mocks/service/user.mock';
import './mocks/util/core-class';
import './mocks/service/Signer/web3.mock';
import './mocks/service/Signer/Wallet.mock';
import './mocks/github-oauth-popup.mock';
import './mocks/router.mock';
import './mocks/web3.mock';
import './mocks/walletGet.mock';
import './mocks/locales/i18n.mock';
import './mocks/locales/i18nSetup.mock';

global.flushPromises = () => new Promise(resolve => setImmediate(resolve));
