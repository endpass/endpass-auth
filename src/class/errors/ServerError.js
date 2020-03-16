// @ts-check

class ServerError extends Error {
  /**
   * @param {string} message
   * @param {string} [code]
   */
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

export default ServerError;
