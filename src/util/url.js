import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';

export const queryParamsToObject = query =>
  query
    .replace(/^\?/, '')
    .split('&')
    .reduce((acc, param) => {
      const [key, value] = param.split('=');

      if (!key) return acc;

      return Object.assign(acc, {
        [camelCase(key)]: value,
      });
    }, {});

export const objectToQueryParams = object =>
  Object.keys(object).reduce(
    (acc, key) =>
      !acc
        ? `${snakeCase(key)}=${object[key]}`
        : `${acc}&${snakeCase(key)}=${object[key]}`,
    '',
  );

export const appendQueryParametersToUrl = (url, params) => {
  const stringifiedParams = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&');

  if (url.includes('?')) {
    return `${url}&${stringifiedParams}`;
  }

  return `${url}?${stringifiedParams}`;
};

export default {
  queryParamsToObject,
  objectToQueryParams,
  appendQueryParametersToUrl,
};
