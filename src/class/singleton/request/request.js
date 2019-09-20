import http from './http';
import { ORIGIN_HOST } from '@/constants';
import Request from '@/class/Request';
import defaultConfig from '@/class/singleton/request/defaultConfig';

const configWithHeaders = {
  ...defaultConfig,
  headers: {
    'x-connect-lib-host': ORIGIN_HOST,
  },
};

export default new Request({ http, config: configWithHeaders });
