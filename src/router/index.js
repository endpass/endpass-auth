import { isEmpty } from 'lodash';
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
  const needAuth = ['User', 'SignScreen'].includes(to.name);

  if (!needAuth) {
    return next();
  }

  // await store.dispatch('defineOnlyV3Accounts');
  try {
    // await store.dispatch('defineSettings');
  } finally {
  }
  return !isEmpty(store.state.accounts.accounts) ? next() : next('auth');
});

router.afterEach(() => {});

export default router;
