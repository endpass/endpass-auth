import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { METHODS } from '@/constants';

let lastHeight = 0;
const dialogResize = () => {
  const newHeight = document.body.offsetHeight;
  if (newHeight !== lastHeight) {
    lastHeight = newHeight;
    bridgeMessenger.send(METHODS.DIALOG_RESIZE, {
      offsetHeight: document.body.offsetHeight,
    });
  }
};

// dirty hack for detect resize, when 'resize' event not fired
setInterval(dialogResize, 200);

window.addEventListener('resize', dialogResize);

export default dialogResize;
