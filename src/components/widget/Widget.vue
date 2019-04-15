<template>
  <div class="widget" ref="widget">
    <widget-header
      :balance="balance"
      :collapsed="collapsed"
      @toggle="handleWidgetToggle"
    />
    <widget-content
      :collapsed="collapsed"
      :is-accounts-collapsed="isAccountsCollapsed"
      :accounts="accounts"
      :current-account="currentAccount"
      @account-create="handleAccountCreate"
      @account-change="handleAccountChange"
      @accounts-toggle="handleAccountsToggle"
      @logout="handleLogout"
    />
  </div>
</template>

<script>
import get from 'lodash/get';
import { mapActions, mapState } from 'vuex';
import cryptoDataService from '@/service/cryptoData';
import WidgetHeader from './Header.vue';
import WidgetContent from './Content.vue';

export default {
  name: 'Widget',

  data: () => ({
    balance: '0',
  }),

  computed: {
    ...mapState({
      accounts: state => state.accounts.accounts,
      settings: state => state.accounts.settings,
      collapsed: state => state.widget.collapsed,
      isAccountsCollapsed: state => state.widget.isAccountsCollapsed,
    }),

    currentNet() {
      return get(this.settings, 'net', 1);
    },

    currentAccount() {
      return get(this.settings, 'lastActiveAccount', null);
    },
  },

  watch: {
    async currentAccount() {
      if (this.currentAccount) {
        try {
          // FIXME: throws an error with CORS
          const { balance } = await cryptoDataService.getAccountBalance({
            network: this.currentNet,
            address: this.currentAccount,
          });

          this.balance = balance;
        } catch (err) {
          this.balance = '0';
        }
      }
    },
  },

  methods: {
    ...mapActions([
      'startRemoteWidgetResizing',
      'toggleWidget',
      'toggleAccounts',
      'updateSettings',
      'getAccounts',
    ]),

    handleWidgetToggle() {
      this.toggleWidget(this.$refs.widget);
    },

    handleAccountsToggle() {
      this.toggleAccounts(this.$refs.widget);
    },

    handleAccountCreate() {
      console.log('account create');
    },

    handleAccountChange(account) {
      console.log('account change: ', account);
    },

    handleLogout() {
      console.log('logout');
    },
  },

  async mounted() {
    await this.updateSettings();
    await this.getAccounts();
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
