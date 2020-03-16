import axios from 'axios';
import ServerError from '@/class/errors/ServerError';
import processResponse from './processResponse';

const createHandlerResponseError = error => {
  const { response } = error;
  const responseError = new ServerError(error.message, response.status);

  processResponse(response);

  return Promise.reject(responseError);
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
