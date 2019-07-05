import isNil from 'lodash/isNil';

const isWidgetPinnedToBottom = state => {
  if (!state.position) return true;

  return isNil(state.position.top);
};

const isWidgetPinnedToTop = state => {
  if (!state.position) return false;

  return !isNil(state.position.top);
};

export default {
  isWidgetPinnedToBottom,
  isWidgetPinnedToTop,
};
