// @ts-check
import Request from '@endpass/class/Request';
import http from './http';
import host from '@/class/singleton/host';
import defaultConfig from '@/class/singleton/request/defaultConfig';

const config = {
  ...defaultConfig,
  headers: {
    get 'x-connect-lib-host'() {
      return host.origin;
    },
  },
};

export default new Request({ http, config });
