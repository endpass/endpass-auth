/* eslint-disable */
// based on http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/

const { attachEvent } = document;
const isIE = navigator.userAgent.match(/Trident/);

const requestFrame = (function() {
  const raf =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function(fn) {
      return window.setTimeout(fn, 20);
    };
  return function(fn) {
    return raf(fn);
  };
})();

const cancelFrame = (function() {
  const cancel =
    window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.clearTimeout;
  return function(id) {
    return cancel(id);
  };
})();

function resizeListener(e) {
  const win = e.target || e.srcElement;
  if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
  win.__resizeRAF__ = requestFrame(() => {
    const trigger = win.__resizeTrigger__;
    trigger.__resizeListeners__.forEach(fn => {
      fn.call(trigger, e);
    });
  });
}

function objectLoad(e) {
  this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
  this.contentDocument.defaultView.addEventListener('resize', resizeListener);
}

export const addResizeListener = (element, fn) => {
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = [];
    if (attachEvent) {
      element.__resizeTrigger__ = element;
      element.attachEvent('onresize', resizeListener);
    } else {
      if (getComputedStyle(element).position == 'static')
        element.style.position = 'relative';
      const obj = (element.__resizeTrigger__ = document.createElement(
        'object',
      ));
      obj.setAttribute(
        'style',
        'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;',
      );
      obj.__resizeElement__ = element;
      obj.onload = objectLoad;
      obj.type = 'text/html';
      if (isIE) element.insertAdjacentElement('afterBegin', obj);
      obj.data = 'about:blank';
      if (!isIE) element.insertAdjacentElement('afterBegin', obj);
    }
  }
  element.__resizeListeners__.push(fn);
};

export const removeResizeListener = (element, fn) => {
  element.__resizeListeners__.splice(
    element.__resizeListeners__.indexOf(fn),
    1,
  );
  if (!element.__resizeListeners__.length) {
    if (attachEvent) element.detachEvent('onresize', resizeListener);
    else {
      element.__resizeTrigger__.contentDocument.defaultView.removeEventListener(
        'resize',
        resizeListener,
      );
      element.__resizeTrigger__ = !element.removeChild(
        element.__resizeTrigger__,
      );
    }
  }
};

export default {
  addResizeListener,
  removeResizeListener,
};
