import Bridge from '@/components/screens/Bridge';
import Auth from '@/components/screens/Auth';
import Sign from '@/components/screens/Sign';
import User from '@/components/screens/User';
import Loader from '@/components/screens/Loader';
import SignPermission from '@/components/screens/SignPermission';
import NotFound from '@/components/screens/NotFound';

const routes = [
  {
    path: '/account',
    name: 'User',
    component: User,
  },
  {
    path: '/bridge',
    name: 'Bridge',
    component: Bridge,
  },
  {
    path: '/loader',
    name: 'Loader',
    component: Loader,
  },
  {
    path: '/permission',
    name: 'SignPermission',
    component: SignPermission,
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
  {
    path: '*',
    name: 'NotFound',
    component: NotFound,
  },
];

export default routes;
