export default [
  {
    path: '/public/widget',
    name: 'Widget',
    component: () =>
      import(/* webpackChunkName: "widget" */ '@/components/widget/Widget'),
    meta: {
      isWidgetStream: true,
    },
  },
  {
    path: '/public/auth',
    name: 'PublicAuthScreen',
    component: () =>
      import(
        /* webpackChunkName: "component-public-auth" */ '@/components/screens/public/Auth'
      ),

    meta: {
      isBackground: true,
    },
  },
  {
    path: '/public/login',
    name: 'LoginProvider',
    component: () =>
      import(
        /* webpackChunkName: "component-login-provider" */ '@/components/screens/public/LoginProvider'
      ),

    meta: {
      isBackground: true,
    },
  },
  {
    path: '/public/consent',
    name: 'ConsentProvider',
    component: () =>
      import(
        /* webpackChunkName: "component-consent-provider" */ '@/components/screens/public/ConsentProvider'
      ),

    meta: {
      isBackground: true,
    },
  },
  {
    path: '/public/error',
    name: 'Error',
    component: () =>
      import(
        /* webpackChunkName: "component-error" */ '@/components/screens/public/Error'
      ),

    meta: {
      isBackground: true,
    },
  },
];
