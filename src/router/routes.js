// Dialog routes
import Bridge from '@/components/screens/Bridge';
import Auth from '@/components/screens/Auth';
import Sign from '@/components/screens/Sign';
import User from '@/components/screens/User';
import Loader from '@/components/screens/Loader';
import SignPermission from '@/components/screens/SignPermission';
import NotFound from '@/components/screens/NotFound';

// Public routes
import PublicAuth from '@/components/screens/public/Auth';
import LoginProvider from '@/components/screens/public/LoginProvider';
import ConsentProvider from '@/components/screens/public/ConsentProvider';
import Widget from '@/components/widget/Widget';
import Error from '@/components/screens/public/Error';

const routes = [
  {
    path: '/public/widget',
    name: 'Widget',
    component: Widget,
    meta: {
      isWidget: true,
    },
  },
  {
    path: '/public/auth',
    name: 'PublicAuthScreen',
    component: PublicAuth,
  },
  {
    path: '/public/login',
    name: 'LoginProvider',
    component: LoginProvider,
  },
  {
    path: '/public/consent',
    name: 'ConsentProvider',
    component: ConsentProvider,
  },
  {
    path: '/public/error',
    name: 'Error',
    component: Error,
  },
  {
    path: '/bridge',
    name: 'Bridge',
    component: Bridge,
    meta: {
      isDialog: true,
    },
  },
  {
    path: '/loader',
    name: 'Loader',
    component: Loader,
  },
  {
    path: '/account',
    name: 'User',
    component: User,
    meta: {
      isDialog: true,
    },
  },
  {
    path: '/permission',
    name: 'SignPermission',
    component: SignPermission,
    meta: {
      isDialog: true,
    },
  },
  {
    path: '/auth',
    name: 'AuthScreen',
    component: Auth,
    meta: {
      isDialog: true,
    },
  },
  {
    path: '/sign',
    name: 'SignScreen',
    component: Sign,
    meta: {
      isDialog: true,
    },
  },
  { path: '/fonts' },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound,
  },
];

export default routes;
