const toggleWidget = state => {
  state.collapsed = !state.collapsed;
};

const toggleAccounts = state => {
  state.isAccountsCollapsed = !state.isAccountsCollapsed;
};

const setWidgetSettings = (state, settings) => {
  state.currentSettings = settings;
};

export default {
  toggleWidget,
  toggleAccounts,
  setWidgetSettings,
};
