const expandWidget = state => {
  state.isExpanded = true;
};

const minimizeWidget = state => {
  state.isExpanded = false;
};

const setMobileModeStatus = (state, status) => {
  state.isMobile = status;
};

const setWidgetLoadingStatus = (state, status) => {
  state.isLoading = status;
};

const setWidgetPosition = (state, position) => {
  state.position = position;
};

export default {
  expandWidget,
  minimizeWidget,
  setMobileModeStatus,
  setWidgetLoadingStatus,
  setWidgetPosition,
};
