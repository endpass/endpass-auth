<template>
  <div class="widget" ref="widget">
    <widget-header
      :balance="formattedBalance"
      :collapsed="isCollapsed"
      @toggle="handleWidgetToggle"
    />
    <widget-content
      :collapsed="isCollapsed"
      :is-accounts-collapsed="isAccountsCollapsed"
      :accounts="availableAccounts"
      :current-account="currentAccount"
      @account-change="handleAccountChange"
      @accounts-toggle="handleAccountsToggle"
      @logout="handleLogout"
    />
  </div>
</template>

<script>
import get from 'lodash/get';
import { mapActions, mapGetters, mapState } from 'vuex';
import cryptoDataService from '@/service/cryptoData';
import { fromWei } from '@/util/number';
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
      settings: state => state.widget.currentSettings,
    }),
    ...mapGetters(['availableAccounts']),

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
      'openWidget',
      'closeWidget',
      'openAccounts',
      'closeAccounts',
      'getWidgetSettings',
      'widgetLogout',
      'changeWidgetAccount',
      'getAccounts',
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
