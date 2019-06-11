import axios from 'axios';
import processResponse from './processResponse';

const createHandlerResponseError = error => {
  const { response } = error;

  processResponse(response);

  return Promise.reject(error);
};

const createHandleResponseSuccess = response => {
  processResponse(response);

  return response;
};

export function createAxiosInstance() {
  const instance = axios.create();

  instance.interceptors.response.use(
    createHandleResponseSuccess,
    createHandlerResponseError,
  );

  return instance;
}

export default createAxiosInstance();
