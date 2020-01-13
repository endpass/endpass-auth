// @ts-check
import Request from '@endpass/class/Request';
import http from './http';
import host from '@/class/singleton/host';
import defaultConfig from '@/class/singleton/request/defaultConfig';

const requestConfig = {
  ...defaultConfig,
  headers: {},
};

http.interceptors.request.use(
  config => {
    return {
      ...config,
      headers: {
        ...config.headers,
        'x-connect-lib-host': host.origin,
      },
    };
  },
  error => Promise.reject(error),
);

export default new Request({ http, config: requestConfig });
