export default [
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
];
