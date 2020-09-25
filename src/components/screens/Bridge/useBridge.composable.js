import { coreStore } from '@/store';
import pkg from '../../../../package.json';

if (ENV.VUE_APP_SHOW_VERSION_INFO) {
  // eslint-disable-next-line no-console
  console.info(
    `%cEndpass Auth Bridge (${pkg.version}) loaded 🔌`,
    'font-size: 14px; font-weight: bold',
  );
}

export const useBridge = () => {
  const dialogClose = () => coreStore.dialogClose();
  const { version } = pkg;

  return {
    dialogClose,
    version,
  };
};
