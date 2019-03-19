export default class SyncChannel {
  constructor() {
    this.resolve = null;
  }

  take() {
    if (this.resolve) {
      throw new Error('SyncChannel is busy, doh...');
    }
    return new Promise(resolve => {
      this.resolve = resolve;
    });
  }

  put(data) {
    if (!this.resolve) {
      return;
      // throw new Error('SyncChannel is not await resolve, uh oh...');
    }
    this.resolve(data);
    this.resolve = null;
  }
}
