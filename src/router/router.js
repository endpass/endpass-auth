import Vue from 'vue';
import Router from 'vue-router';
import { coreStore } from '@/store';
import routes from './routes';

Vue.use(Router);

const router = new Router({
  // mode: 'history',
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { isDialog, isWidget, isBackground } = to.meta;
  const needDialogRedirect = isDialog && !coreStore.isDialog;

  if (!isBackground) {
    document.body.classList.add('transparent');
  }

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

  await coreStore.initResize();

  if (isDialog) {
    await coreStore.initDialog();
  }

  if (isWidget) {
    await coreStore.initWidget();
  }

  if (!isDialog && !isWidget) {
    coreStore.changeInitStatus(true);
  }
});

export default router;
