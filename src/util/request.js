import axios from 'axios';
import { ORIGIN_HOST } from '@/constants';

const config = {
  withCredentials: true,
  headers: {
    'x-connect-lib-host': ORIGIN_HOST,
  },
};

function createAnswer(request) {
  return request.then(({ data }) => data);
}

const request = {
  get: url => createAnswer(axios.get(url, config)),

  post: (url, body) => createAnswer(axios.post(url, body, config)),
};

export default request;
