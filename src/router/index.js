import { isEmpty } from 'lodash';
import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import routes from './routes';
import baseRoute from '@/router/baseRoute';

Vue.use(Router);

const base = window.location.pathname.indexOf(baseRoute) === 0 ? baseRoute : '';

const router = new Router({
  mode: 'history',
  base: `${base}`,
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
