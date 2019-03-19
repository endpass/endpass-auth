import { isEmpty } from 'lodash';
import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

import Bridge from '@/components/Bridge';
import Auth from '@/components/screens/Auth';
import AuthGit from '@/components/screens/AuthGit';
import Sign from '@/components/screens/Sign';
import User from '@/components/screens/User';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'User',
      component: User,
    },
    {
      path: '/bridge',
      name: 'Bridge',
      component: Bridge,
    },
    {
      path: '/auth',
      name: 'AuthScreen',
      component: Auth,
    },
    {
      path: '/sign',
      name: 'SignScreen',
      component: Sign,
    },
  ],
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
