const toggleWidget = state => {
  state.collapsed = !state.collapsed;
};

const toggleAccounts = state => {
  state.isAccountsCollapsed = !state.isAccountsCollapsed;
};

export default {
  toggleWidget,
  toggleAccounts,
};
