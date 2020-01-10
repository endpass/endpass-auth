// @ts-check
import Request from '@endpass/class/Request';
import http from './http';
import Host from '@/class/singleton/Host';
import defaultConfig from '@/class/singleton/request/defaultConfig';

const config = {
  ...defaultConfig,
  headers: {
    get 'x-connect-lib-host'() {
      return Host.origin;
    },
  },
};

export default new Request({ http, config });
