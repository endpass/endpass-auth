export default class Answer {
  static createOk(payload) {
    return {
      status: true,
      payload,
    };
  }

  static createFail(error) {
    return {
      status: false,
      error,
    };
  }
}
