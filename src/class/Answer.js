export default class Answer {
  static createOk(payload) {
    return {
      status: true,
      payload,
    };
  }

  // TODO: `error` field support < 0.24 version
  static createFail(code, error) {
    return {
      status: false,
      code,
      error,
    };
  }
}
