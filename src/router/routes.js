const routes = [
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
  {
    path: '/document-create',
    name: 'DocumentCreate',
    component: () =>
      import(
        /* webpackChunkName: "document-create" */ '@/components/screens/DocumentCreate'
      ),
    meta: {
      isDialogStream: true,
      isBackground: true,
    },
  },
  {
    path: '/wallet-generate',
    name: 'WalletGenerate',
    component: () =>
      import(
        /* webpackChunkName: "wallet-create" */ '@/components/screens/WalletGenerate'
      ),
    meta: {
      isDialogStream: true,
      isBackground: true,
    },
  },
  {
    path: '/wallet-create',
    name: 'WalletCreate',
    component: () =>
      import(
        /* webpackChunkName: "wallet-create" */ '@/components/screens/WalletCreate'
      ),
    meta: {
      isDialogStream: true,
      isBackground: true,
    },
  },
  {
    path: '/wallet-create/error',
    name: 'WalletCreateError',
    component: () =>
      import(
        /* webpackChunkName: "wallet-create-error" */ '@/components/screens/WalletCreateError'
      ),
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

export default routes;
