import axios from 'axios';
import get from 'lodash/get';
import ServerError from '@/class/errors/ServerError';
import processResponse from './processResponse';

const createHandlerResponseError = ({ response, message }) => {
  const errorMessage = get(response, 'data.message', message);
  const errorCode = get(response, 'data.code', response.status);
  const responseError = new ServerError({
    message: errorMessage,
    code: errorCode,
    response,
  });

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
