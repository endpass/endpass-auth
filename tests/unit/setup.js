import 'jest-localstorage-mock';

import './mocks/service/identity.mock';
import './mocks/service/settings.mock';
import './mocks/service/cryptoData.mock';
import './mocks/service/permissions.mock';
import './mocks/util/core-class';
import './mocks/service/Signer/web3.mock';
import './mocks/service/Signer/Wallet.mock';
import './mocks/github-oauth-popup.mock';
import './mocks/router.mock';
import './mocks/web3.mock';
import './mocks/walletGet.mock';

global.flushPromises = () => new Promise(resolve => setImmediate(resolve));
