<template>
  <div class="widget" ref="widget">
    <widget-header
      :balance="formattedBalance"
      :collapsed="collapsed"
      @toggle="handleWidgetToggle"
    />
    <widget-content
      :collapsed="collapsed"
      :is-accounts-collapsed="isAccountsCollapsed"
      :accounts="accounts"
      :current-account="currentAccount"
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
import { fromWei } from '@/util/number';
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
      collapsed: state => state.widget.collapsed,
      settings: state => state.widget.currentSettings,
      isAccountsCollapsed: state => state.widget.isAccountsCollapsed,
    }),

    currentNet() {
      return get(this.settings, 'activeNet', 1);
    },

    currentAccount() {
      return get(this.settings, 'activeAccount', null);
    },

    formattedBalance() {
      return fromWei(this.balance);
    },
  },

  watch: {
    async currentAccount() {
      if (this.currentAccount) {
        try {
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
      'getWidgetSettings',
      'getAccounts',
      'changeWidgetAccount',
      'widgetLogout',
    ]),

    handleWidgetToggle() {
      this.toggleWidget(this.$refs.widget);
    },

    handleAccountsToggle() {
      this.toggleAccounts(this.$refs.widget);
    },

    async handleAccountChange(address) {
      await this.changeWidgetAccount(address);
    },

    async handleLogout() {
      await this.widgetLogout();
    },
  },

  async mounted() {
    await this.getWidgetSettings();
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
