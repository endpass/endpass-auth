import Vue from 'vue';
import Router from 'vue-router';
import { coreStore } from '@/store';
import routes from './routes';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { isDialogStream, isWidgetStream, isBackground } = to.meta;

  if (!isBackground) {
    document.body.classList.add('transparent');
  }

  if (!coreStore.isInitStarted) {
    try {
      await coreStore.initStreams({ isDialogStream, isWidgetStream });
    } catch (e) {
      return next('Error');
    }
  }

  switch (true) {
    // Github authentification handling and widget redirect preventing
    case to.query.code || isWidgetStream:
      return next();

    case isDialogStream && !coreStore.isDialog && to.name !== 'Bridge':
      return next('bridge');

    default:
      return next();
  }
});

export default router;
