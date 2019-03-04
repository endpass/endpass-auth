import { isEmpty } from 'lodash';
import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import queryStringToMap from '@endpass/utils/queryStringToMap';

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
  const isPublicRoute = ['AuthScreen', 'AuthGitScreen', 'Bridge'].includes(
    to.name,
  );

  const searchString = (window.location.search || '').substring(1);
  const query = queryStringToMap(searchString);
  if (query.demoData) {
    await store.dispatch('setupDemoData', query.demoData);
  }

  if (store.getters.demoData || isPublicRoute) {
    return next();
  }

  await store.dispatch('defineOnlyV3Accounts');
  try {
    await store.dispatch('defineSettings');
  } finally {
    return !isEmpty(store.state.accounts.accounts) ? next() : next('auth');
  }
});

export default router;
