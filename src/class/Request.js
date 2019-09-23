// @ts-check
export default class Request {
  /**
   * @param {object} props
   * @param {object} props.config
   * @param {import('axios').AxiosInstance} props.http
   */
  constructor({ config, http }) {
    this.config = config;
    this.uploadConfig = {
      ...config,
      headers: { ...config.headers, 'Content-Type': 'multipart/form-data' },
    };
    this.http = http;
  }

  /**
   *
   * @param {import('axios').AxiosPromise} request Axios response
   * @return {Promise<any>}
   */
  createAnswer(request) {
    return request.then(({ data }) => data);
  }

  /**
   * @param {string} url
   * @param {object=} [config]
   * @return {Promise<any>}
   */
  get(url, config) {
    return this.createAnswer(this.http.get(url, { ...this.config, ...config }));
  }

  /**
   * @param {string} url
   * @param {any} body
   * @param {object=} [config]
   * @return {Promise<any>}
   */
  post(url, body, config) {
    return this.createAnswer(
      this.http.post(url, body, {
        ...this.config,
        ...config,
      }),
    );
  }

  /**
   * @param {string} url
   * @param {object=} [config]
   * @return {Promise<any>}
   */
  delete(url, config) {
    return this.createAnswer(
      this.http.delete(url, {
        ...this.config,
        ...config,
      }),
    );
  }

  /**
   * @param {string} url
   * @param {object} fields
   * @param {object=} [config]
   * @return {Promise<any>}
   */
  upload(url, fields, config) {
    const body = Object.keys(fields).reduce((form, key) => {
      form.append(key, fields[key]);
      return form;
    }, new FormData());

    return this.createAnswer(
      this.http.post(url, body, {
        ...this.uploadConfig,
        ...config,
      }),
    );
  }
}
