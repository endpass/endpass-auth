// @ts-check

class ServerError extends Error {
  /**
   * @param {object} params
   * @param {string} params.message
   * @param {string|number} [params.code]
   * @param {object} [params.response]
   */
  constructor({ message, code, response }) {
    super(message);
    this.code = code;
    this.response = response;
  }
}

export default ServerError;
