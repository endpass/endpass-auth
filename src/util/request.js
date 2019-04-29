import axios from 'axios';
import { ORIGIN_HOST } from '@/constants';

const config = {
  withCredentials: true,
};

const configWithHeaders = {
  ...config,
  headers: {
    'x-connect-lib-host': ORIGIN_HOST,
  },
};

function createAnswer(request) {
  return request.then(({ data }) => data);
}

const request = {
  get: url => createAnswer(axios.get(url, configWithHeaders)),

  getSkipPermission: url => createAnswer(axios.get(url, config)),

  post: (url, body) => createAnswer(axios.post(url, body, configWithHeaders)),
};

export default request;
