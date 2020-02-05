<template>
  <div
    class="widget"
    data-test="widget-container"
  >
    <div
      v-if="isMobile"
      ref="trigger"
      class="widget-trigger"
    >
      <trigger-button
        :is-loading="isWidgetLoading"
        @click="handleMobileTriggerClick"
      />
    </div>
    <div
      v-show="isWidgetFrameVisible"
      ref="widget"
      :class="{
        'widget-frame': true,
        mobile: isMobile,
        visible: isExpanded,
        top: isWidgetPinnedToTop,
        bottom: isWidgetPinnedToBottom,
      }"
    >
      <widget-header
        :fiat-currency="fiatCurrency"
        :is-collapsed="isCollapsed"
        :is-balance-loading="isBalanceLoading"
        :eth-balance="ethBalance"
        @toggle="handleWidgetToggle"
      />
      <widget-content :is-collapsed="isCollapsed">
        <widget-new-account-form
          v-if="isAccountCreating"
          :current-account="currentAccount"
          :is-loading="isWidgetLoading"
          @cancel="handleAccountCreationCancel"
        />
        <widget-accounts
          v-else
          :accounts="accounts"
          :current-account="currentAccount"
          :is-loading="isLoading"
          @new-account="handleNewAccountStart"
          @account-change="handleAccountChange"
          @accounts-toggle="handleAccountsToggle"
          @logout="handleLogout"
        />
      </widget-content>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get';
import { mapActions, mapState, mapGetters } from 'vuex';
import WidgetHeader from './Header';
import WidgetContent from './Content';
import WidgetAccounts from './Accounts';
import WidgetNewAccountForm from './NewAccountForm';
import TriggerButton from './TriggerButton';
import { authStore, accountsStore, coreStore } from '@/store';

export default {
  name: 'Widget',

  accountsStore,
  coreStore,
  authStore,

  data: () => ({
    widgetSettings: null,
    isCollapsed: true,
    isAccountCreating: false,
    isAccountsCollapsed: true,
  }),

  computed: {
    ...mapState({
      isMobile: state => state.widget.isMobile,
      isExpanded: state => state.widget.isExpanded,
      isWidgetLoading: state => state.widget.isLoading,
    }),
    accounts() {
      return this.$options.accountsStore.accounts;
    },
    settings() {
      return this.$options.accountsStore.settings;
    },
    isLoading() {
      return this.$options.coreStore.isLoading;
    },
    isBalanceLoading() {
      return this.$options.accountsStore.isBalanceLoading;
    },
    ethBalance() {
      return this.$options.accountsStore.ethBalance;
    },
    ...mapGetters(['isWidgetPinnedToBottom', 'isWidgetPinnedToTop']),

    fiatCurrency() {
      return get(this.settings, 'fiatCurrency', 'USD');
    },

    currentAccount() {
      return get(this.settings, 'lastActiveAccount', null);
    },

    isWidgetFrameVisible() {
      return this.isMobile ? this.isExpanded : true;
    },
  },

  watch: {
    isExpanded(newValue) {
      if (newValue) {
        this.isCollapsed = true;
        this.isAccountsCollapsed = true;
      }
    },
  },

  methods: {
    ...mapActions([
      'initWidget',
      'fitWidget',
      'openWidget',
      'closeWidget',
      'openAccounts',
      'closeAccounts',
      'expandMobileWidget',
      'collapseMobileWidget',
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

    handleMobileTriggerClick() {
      if (this.isWidgetLoading) return;

      if (this.isExpanded) {
        this.collapseMobileWidget(this.$refs.trigger.clientWidth);
      } else {
        this.expandMobileWidget();
      }
    },

    handleNewAccountStart() {
      this.isAccountCreating = true;
    },

    handleAccountCreationCancel() {
      this.isAccountCreating = false;
      this.fitWidget(this.$refs.widget);
    },

    async handleAccountChange(address) {
      await this.$options.accountsStore.updateSettings({
        lastActiveAccount: address,
      });
    },

    async handleLogout() {
      try {
        this.$options.coreStore.logout();
      } catch (err) {
        /* eslint-disable-next-line */
        console.log(err);
      }
    },
  },

  async mounted() {
    await this.$options.accountsStore.defineSettings();

    await this.initWidget();

    await this.$options.accountsStore.defineOnlyV3Accounts();
    await this.$options.authStore.defineAuthStatus();
    await this.$options.accountsStore.enableAutoUpdateBalance();
  },

  components: {
    WidgetHeader,
    WidgetContent,
    WidgetNewAccountForm,
    WidgetAccounts,
    TriggerButton,
  },
};
</script>

<style lang="postcss">
.widget-trigger {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
  display: block;
}

.widget-frame {
  overflow: hidden;
  position: absolute;
  left: 50%;
  width: 280px;
  transform: translateX(-50%);
  border-radius: 4px;

  &.bottom {
    bottom: 0;
  }

  &.top {
    top: 0;
  }

  &.mobile {
    position: absolute;
    left: 0;
    bottom: 0;
    top: auto;
    z-index: 2;
    display: none;
    transform: none;
    width: 100%;

    &.visible {
      display: block;
    }
  }
}
</style>
