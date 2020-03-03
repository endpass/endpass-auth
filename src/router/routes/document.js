export default [
  {
    path: '/document-create-single',
    name: 'DocumentCreateSingle',
    component: () =>
      import(
        /* webpackChunkName: "document-create-single" */ '@/components/modules/document/CreateSingle'
      ),
    meta: {
      isDialogStream: true,
      isBackground: true,
    },
  },
  {
    path: '/document-create-required',
    name: 'DocumentCreateRequired',
    component: () =>
      import(
        /* webpackChunkName: "document-create-required" */ '@/components/modules/document/CreateRequired'
      ),
    meta: {
      isDialogStream: true,
      isBackground: true,
    },
  },
];
