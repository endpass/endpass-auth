import http from './http';
import { parseUrl } from '@/util/dom';
import Request from '@/class/Request';
import defaultConfig from '@/class/singleton/request/defaultConfig';

const { origin } = parseUrl(ENV.VUE_APP_WALLET_URL);

const configSkipPermission = {
  ...defaultConfig,
  headers: {
    'x-connect-lib-host': origin,
  },
};

export default new Request({ config: configSkipPermission, http });
