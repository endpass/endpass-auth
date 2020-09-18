// @ts-check
import Request from '@endpass/class/Request';
import defaultConfig from '@/class/singleton/request/defaultConfig';
import host from '@/class/singleton/host';
import http from './http';

const request = new Request({ http, config: defaultConfig });

host.subscribe(() => {
  request.config = {
    ...defaultConfig,
    headers: {
      'x-connect-lib-host': host.origin,
    },
  };
});

export default request;
