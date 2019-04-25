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
import pick from 'lodash/pick';
import { mapActions, mapState } from 'vuex';
import { METHODS } from '@/constants';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import WidgetHeader from './Header.vue';
import WidgetContent from './Content.vue';

export default {
  name: 'Widget',

  data: () => ({
    widgetSettings: null,
    isCollapsed: true,
    isAccountsCollapsed: true,
  }),

  computed: {
    ...mapState({
      accounts: state => state.accounts.accounts,
      settings: state => state.accounts.settings,
      balance: state => state.accounts.balance,
      loading: state => state.core.loading,
    }),

    currentNet() {
      return get(this.widgetSettings, 'net', 1);
    },

    currentAccount() {
      return get(this.widgetSettings, 'lastActiveAccount', null);
    },
  },

  watch: {
    settings(value) {
      if (value && !this.widgetSettings) {
        this.widgetSettings = pick(value, ['lastActiveAccount', 'net']);
      }
    },
  },

  methods: {
    ...mapActions([
      'openWidget',
      'closeWidget',
      'openAccounts',
      'closeAccounts',
      'logout',
      'changeAccount',
      'defineOnlyV3Accounts',
      'defineSettings',
      'getAccountBalance',
      'subscribeOnBalanceUpdates',
      'updateSettings',
    ]),

    createSettingsSubscribtion() {
      bridgeMessenger.subscribe(
        METHODS.CHANGE_SETTINGS_RESPONSE,
        ({ activeAccount, activeNet }) => {
          this.widgetSettings = {
            lastActiveAccount: activeAccount,
            net: activeNet,
          };
        },
      );
    },

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
      await this.updateSettings({
        lastActiveAccount: address,
      });
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
    this.createSettingsSubscribtion();
    await this.defineSettings();
    await this.defineOnlyV3Accounts();
    this.subscribeOnBalanceUpdates();
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
