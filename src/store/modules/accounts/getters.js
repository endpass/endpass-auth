export default {
  addresses: state => state.accounts.map(({ address }) => address),

  demoData: state => state.demoData,

  isAuthorized: state => state.isLogin && state.isPermission,
};
