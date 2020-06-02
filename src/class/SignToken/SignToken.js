/* eslint-disable no-bitwise */
export default class SignToken {
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

  getObjectHash(obj) {
    const str = JSON.stringify(obj);
    return this.getHash(str);
  }

  parse(rawStr = '') {
    const jsonString = decodeURIComponent(escape(window.atob(rawStr)));
    const jsonData = JSON.parse(jsonString);
    const { d: data, h } = jsonData;
    const checkHash = this.getObjectHash(data);
    if (checkHash !== h) {
      throw new Error('wrong hash');
    }

    return data;
  }

  /**
   *
   * @param data
   * @returns {{error: Error}|string|{error: *}}
   */
  stringify(data) {
    const hash = this.getObjectHash(data);
    const signDataObject = {
      d: data,
      h: hash,
    };
    const jsonString = JSON.stringify(signDataObject);
    return window.btoa(unescape(encodeURIComponent(jsonString)));
  }
}
