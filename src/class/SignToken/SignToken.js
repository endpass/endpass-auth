// @ts-check

/* eslint-disable no-bitwise */
export default class SignToken {
  /**
   * Return hash number from string
   * @private
   * @param {string} str
   * @return {number}
   */
  getHash(str) {
    let hash = 4678;
    let i = str.length;

    while (i) {
      i -= 1;
      hash = (hash * 33) ^ str.charCodeAt(i);
    }

    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift. */
    return hash >>> 0;
  }

  /**
   * Return hash number from any data
   * @private
   * @param {*} data
   * @return {number}
   */
  getDataHash(data) {
    const str = JSON.stringify(data);
    return this.getHash(str);
  }

  /**
   * Return data from encrypted string
   * @param {string} rawStr
   * @return {*}
   */
  parse(rawStr = '') {
    const jsonString = decodeURIComponent(escape(window.atob(rawStr)));
    const jsonData = JSON.parse(jsonString);
    const { d: data, h } = jsonData;
    const checkHash = this.getDataHash(data);
    if (checkHash !== h) {
      throw new Error('wrong hash');
    }

    return data;
  }

  /**
   * Encrypt data to string
   * @param {*} data
   * @returns {string}
   */
  stringify(data) {
    const hash = this.getDataHash(data);
    const signDataObject = {
      d: data,
      h: hash,
    };
    const jsonString = JSON.stringify(signDataObject);
    return window.btoa(unescape(encodeURIComponent(jsonString)));
  }
}
