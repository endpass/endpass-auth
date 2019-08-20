// Dialog routes
import Bridge from '@/components/screens/Bridge';
import Auth from '@/components/screens/Auth';
import User from '@/components/screens/User';
import Loader from '@/components/screens/Loader';
import SignPermission from '@/components/screens/SignPermission';
import NotFound from '@/components/screens/NotFound';

// Public routes
import PublicAuth from '@/components/screens/public/Auth';
import LoginProvider from '@/components/screens/public/LoginProvider';
import ConsentProvider from '@/components/screens/public/ConsentProvider';
import Error from '@/components/screens/public/Error';

const routes = [
  {
    path: '/public/widget',
    name: 'Widget',
    component: () =>
      import(/* webpackChunkName: "widget" */ '@/components/widget/Widget'),
    meta: {
      isWidget: true,
    },
  },
  {
    path: '/public/auth',
    name: 'PublicAuthScreen',
    component: PublicAuth,
    meta: {
      isBackground: true,
    },
  },
  {
    path: '/public/login',
    name: 'LoginProvider',
    component: LoginProvider,
    meta: {
      isBackground: true,
    },
  },
  {
    path: '/public/consent',
    name: 'ConsentProvider',
    component: ConsentProvider,
    meta: {
      isBackground: true,
    },
  },
  {
    path: '/public/error',
    name: 'Error',
    component: Error,
    meta: {
      isBackground: true,
    },
  },
  {
    path: '/bridge',
    name: 'Bridge',
    component: Bridge,
    meta: {
      isDialog: true,
      isBackground: true,
    },
  },
  {
    path: '/loader',
    name: 'Loader',
    component: Loader,
    meta: {
      isBackground: true,
    },
  },
  {
    path: '/account',
    name: 'User',
    component: User,
    meta: {
      isDialog: true,
      isBackground: true,
    },
  },
  {
    path: '/permission',
    name: 'SignPermission',
    component: SignPermission,
    meta: {
      isDialog: true,
      isBackground: true,
    },
  },
  {
    path: '/auth',
    name: 'AuthScreen',
    component: Auth,
    meta: {
      isDialog: true,
      isBackground: true,
    },
  },
  {
    // TODO: change to lazy load instead of sub components
    path: '/sign',
    name: 'SignScreen',
    component: () =>
      import(/* webpackChunkName: "screen-sign" */ '@/components/screens/Sign'),
    meta: {
      isDialog: true,
      isBackground: true,
    },
  },
  { path: '/fonts' },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      isBackground: true,
    },
  },
];

export default routes;
