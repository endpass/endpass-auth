export default class Channel {
  constructor(name) {
    this.name = name;
    this.resolvers = [];
  }

  take() {
    return new Promise(resolve => {
      this.resolvers.push(resolve);
    });
  }

  put(data) {
    if (!this.resolvers.length) {
      return;
      // throw new Error('Channel is not await resolve, uh oh...');
    }
    this.resolvers.forEach(resolve => resolve(data));
    this.resolvers.length = 0;
  }
}
