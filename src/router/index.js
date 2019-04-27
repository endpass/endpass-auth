import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import routes from './routes';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { isDialog, isWidget } = to.meta;
  const needDialogRedirect = isDialog && !store.getters.isDialog;

  // Github authentification handling and widget redirect preventing
  if (to.query.code || isWidget) {
    return next();
  }

  if (needDialogRedirect && to.name !== 'Bridge') {
    return next('bridge');
  }

  return next();
});

router.afterEach(async to => {
  const { isDialog, isWidget } = to.meta;

  if (isDialog) {
    await store.dispatch('initDialog');
  }

  if (isWidget) {
    await store.dispatch('initWidget');
  }
});

export default router;
