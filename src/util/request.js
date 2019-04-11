import axios from 'axios';
import { ORIGIN_HOST } from '@/constants';

const request = {
  get: url =>
    axios
      .get(url, {
        withCredentials: true,
      })
      .then(({ data }) => data),

  post: (url, body) =>
    axios
      .post(url, body, {
        withCredentials: true,
      })
      .then(({ data }) => data),
};

// FIXME: mutates global module
axios.defaults.headers.common['x-connect-lib-host'] = ORIGIN_HOST;

export default request;
