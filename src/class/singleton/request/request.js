// @ts-check
import Request from '@endpass/class/Request';
import http from './http';
import { ORIGIN_HOST } from '@/constants';
import defaultConfig from '@/class/singleton/request/defaultConfig';

const config = {
  ...defaultConfig,
  headers: {
    'x-connect-lib-host': ORIGIN_HOST,
  },
};

export default new Request({ http, config });
