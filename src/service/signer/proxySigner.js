async function getSigner() {
  const mod = await import(/* webpackChunkName: "signer" */ './signer');
  return mod.default;
}

export default {
  async validatePassword(params) {
    const Signer = await getSigner();
    return Signer.validatePassword(params);
  },
  async signDataWithAccount(params) {
    const Signer = await getSigner();
    return Signer.signDataWithAccount(params);
  },
  async recover(params) {
    const Signer = await getSigner();
    return Signer.recover(params);
  },
  async recoverMessage(params) {
    const Singer = await getSigner();
    return Singer.recoverMessage(params);
  },
  async getSignedRequest(params) {
    const Singer = await getSigner();
    return Singer.getSignedRequest(params);
  },
};
