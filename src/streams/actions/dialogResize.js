import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { METHODS } from '@/constants';

let lastHeight = 0;
let isInited = false;

const dialogResize = () => {
  const newHeight = document.body.offsetHeight;

  if (newHeight !== lastHeight) {
    lastHeight = newHeight;
    bridgeMessenger.send(METHODS.DIALOG_RESIZE, {
      offsetHeight: newHeight,
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
  setInterval(dialogResize, 200);
};

export default {
  initDialogResize,
};
