import publicRoutes from './routes/public';
import authenticator from './routes/authenticator';
import wallet from './routes/wallet';
import document from './routes/document';

const routesList = [
  ...publicRoutes,
  ...authenticator,
  ...wallet,
  ...document,
  {
    path: '/bridge',
    name: 'Bridge',
    component: () =>
      import(
        /* webpackChunkName: "component-bridge" */ '@/components/screens/Bridge'
      ),

    meta: {
      isDialogStream: true,
      isBackground: true,
    },
  },
  {
    path: '/loader',
    name: 'Loader',
    component: () =>
      import(
        /* webpackChunkName: "component-loader" */ '@/components/screens/Loader'
      ),

    meta: {
      isBackground: true,
    },
  },
  {
    path: '/account',
    name: 'User',
    component: () =>
      import(
        /* webpackChunkName: "component-user" */ '@/components/screens/User'
      ),

    meta: {
      isDialogStream: true,
      isBackground: true,
    },
  },
  {
    path: '/permission',
    name: 'SignPermission',
    component: () =>
      import(
        /* webpackChunkName: "component-sign-permission" */ '@/components/screens/SignPermission'
      ),

    meta: {
      isDialogStream: true,
      isBackground: true,
    },
  },
  {
    path: '/auth',
    name: 'AuthScreen',
    component: () =>
      import(
        /* webpackChunkName: "component-auth" */ '@/components/screens/Auth'
      ),

    meta: {
      isDialogStream: true,
      isBackground: true,
    },
  },
  {
    path: '/sign',
    name: 'SignScreen',
    component: () =>
      import(/* webpackChunkName: "screen-sign" */ '@/components/screens/Sign'),
    meta: {
      isDialogStream: true,
      isBackground: true,
    },
  },
  { path: '/fonts' },
  {
    path: '*',
    name: 'NotFound',
    component: () =>
      import(
        /* webpackChunkName: "component-not-found" */ '@/components/screens/NotFound'
      ),

    meta: {
      isBackground: true,
    },
  },
];

export default routesList;
