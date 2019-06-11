export default {
  demoData: state => state.demoData,
  isAuthorized: state => state.isLogin && state.isPermission,
};
