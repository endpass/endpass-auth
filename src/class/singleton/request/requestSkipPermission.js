// @ts-check
import Request from '@endpass/class/Request';
import http from './http';
import { parseUrl } from '@/util/dom';
import defaultConfig from '@/class/singleton/request/defaultConfig';

const { origin } = parseUrl(ENV.VUE_APP_WALLET_URL);

const config = {
  ...defaultConfig,
  headers: {
    'x-connect-lib-host': origin,
  },
};

export default new Request({ config, http });
