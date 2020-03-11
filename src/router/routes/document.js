export default [
  {
    path: '/document-create-single',
    name: 'DocumentCreateSingle',
    // TODO: replace after finished task with create required
    component: () =>
      import(
        /* webpackChunkName: "document-create-single" */ '@/components/modules/document/DocSingleCreation'
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
        /* webpackChunkName: "document-create-required" */ '@/components/modules/document/DocRequiredCreation'
      ),
    meta: {
      isDialogStream: true,
      isBackground: true,
    },
  },
];
