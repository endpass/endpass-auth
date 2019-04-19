export default {
  availableAccounts: state =>
    state.accounts.filter(account => account.type !== 'PublicAccount'),
  demoData: state => state.demoData,
  isAuthorized: state => state.isLogin && state.isPermission,
};
