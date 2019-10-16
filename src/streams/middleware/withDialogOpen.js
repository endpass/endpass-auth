import router from '@/router';

export default async function withDialogOpen({ routeName }) {
  if (routeName !== undefined) {
    router.replace(`/${routeName}`);
  }
}
