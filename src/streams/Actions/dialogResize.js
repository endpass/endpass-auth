import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { METHODS } from '@/constants';
import { addResizeListener } from '@/util/resizeListener';

let lastHeight = 0;
let isInited = false;

const dialogResize = () => {
  const newHeight = document.body.offsetHeight;

  if (newHeight !== lastHeight) {
    lastHeight = newHeight;
    bridgeMessenger.send(METHODS.DIALOG_RESIZE, {
      offsetHeight: document.body.offsetHeight,
    });
  }
};

export const initDialogResize = () => {
  if (isInited) {
    return;
  }
  isInited = true;

  dialogResize();

  document.body.style.overflow = 'hidden';
  window.addEventListener('resize', dialogResize);
  const rootEl = document.body.querySelector('#root');
  if (!rootEl) {
    console.error('#root node is not defined! Resize will not work');
    return;
  }
  addResizeListener(rootEl, dialogResize);
};

export default {
  initDialogResize,
};
