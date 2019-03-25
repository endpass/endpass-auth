import Bridge from '@/components/Bridge';
import Auth from '@/components/screens/Auth';
import Sign from '@/components/screens/Sign';
import User from '@/components/screens/User';

const routes = [
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
];

export default routes;
