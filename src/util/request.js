import axios from 'axios';
import { ORIGIN_HOST } from '@/constants';
import { parseUrl } from '@/util/dom';

const config = {
  withCredentials: true,
};

const configWithHeaders = {
  ...config,
  headers: {
    'x-connect-lib-host': ORIGIN_HOST,
  },
};

const { origin } = parseUrl(ENV.VUE_APP_WALLET_URL);

const configSkipPermission = {
  ...config,
  headers: {
    'x-connect-lib-host': origin,
  },
};

function createAnswer(request) {
  return request.then(({ data }) => data);
}

const request = {
  get: url => createAnswer(axios.get(url, configWithHeaders)),

  getSkipPermission: url => createAnswer(axios.get(url, configSkipPermission)),

  post: (url, body) => createAnswer(axios.post(url, body, configWithHeaders)),

  postSkipPermission: (url, body) =>
    createAnswer(axios.post(url, body, configSkipPermission)),
};

export default request;
