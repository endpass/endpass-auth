<template>
  <div class="widget" ref="widget">
    <widget-header
      :balance="balance"
      :is-collapsed="isCollapsed"
      @toggle="handleWidgetToggle"
    />
    <widget-content
      :is-collapsed="isCollapsed"
      :is-accounts-collapsed="isAccountsCollapsed"
      :accounts="accounts"
      :current-account="currentAccount"
      :is-loading="loading"
      @account-change="handleAccountChange"
      @accounts-toggle="handleAccountsToggle"
      @logout="handleLogout"
    />
  </div>
</template>

<script>
import get from 'lodash/get';
import { mapActions, mapState } from 'vuex';
import WidgetHeader from './Header.vue';
import WidgetContent from './Content.vue';

export default {
  name: 'Widget',

  data: () => ({
    balance: '0',
    isCollapsed: true,
    isAccountsCollapsed: true,
  }),

  computed: {
    ...mapState({
      accounts: state => state.accounts.accounts,
      loading: state => state.core.loading,
      settings: state => state.widget.settings,
    }),

    currentNet() {
      return get(this.settings, 'activeNet', 1);
    },

    currentAccount() {
      return get(this.settings, 'activeAccount', null);
    },
  },

  watch: {
    async currentAccount() {
      if (this.currentAccount) {
        try {
          this.balance = await this.getAccountBalance();
        } catch (err) {
          this.balance = '0';
        }
      }
    },
  },

  methods: {
    ...mapActions([
      'openWidget',
      'closeWidget',
      'openAccounts',
      'closeAccounts',
      'getWidgetSettings',
      'logout',
      'changeAccount',
      'defineOnlyV3Accounts',
      'getAccountBalance',
    ]),

    handleWidgetToggle() {
      if (this.isCollapsed) {
        this.openWidget({
          widgetNode: this.$refs.widget,
          root: true,
        });
      } else {
        this.closeWidget(this.$refs.widget);
      }

      this.isCollapsed = !this.isCollapsed;
    },

    handleAccountsToggle() {
      if (this.isAccountsCollapsed) {
        this.openAccounts(this.$refs.widget);
      } else {
        this.closeAccounts(this.$refs.widget);
      }

      this.isAccountsCollapsed = !this.isAccountsCollapsed;
    },

    async handleAccountChange(address) {
      await this.changeAccount(address);
    },

    async handleLogout() {
      try {
        this.logout();
      } catch (err) {
        console.log(err);
      }
    },
  },

  async mounted() {
    await this.getWidgetSettings();
    await this.defineOnlyV3Accounts();
  },

  components: {
    WidgetHeader,
    WidgetContent,
  },
};
</script>

<style lang="postcss">
body {
  background: none !important;
}

.widget {
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 240px;
  transform: translateX(-50%);
  border-radius: 4px;
  /* box-shadow: 2px 6px 8px rgba(36, 43, 46, 0.15); */
}
</style>
