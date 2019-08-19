<template>
  <div class="widget" data-test="widget-container">
    <div v-if="isMobile" ref="trigger" class="widget-trigger">
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
        :balance="balance"
        :fiat-currency="fiatCurrency"
        :is-collapsed="isCollapsed"
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
          :is-loading="loading"
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
import WidgetContent from './Content.vue';
import WidgetAccounts from './Accounts.vue';
import WidgetNewAccountForm from './NewAccountForm.vue';
import TriggerButton from './TriggerButton.vue';

export default {
  name: 'Widget',

  data: () => ({
    widgetSettings: null,
    isCollapsed: true,
    isAccountCreating: false,
    isAccountsCollapsed: true,
  }),

  computed: {
    ...mapState({
      accounts: state => state.accounts.accounts,
      settings: state => state.accounts.settings,
      balance: state => state.accounts.balance,
      loading: state => state.core.loading,
      isMobile: state => state.widget.isMobile,
      isExpanded: state => state.widget.isExpanded,
      isWidgetLoading: state => state.widget.isLoading,
    }),
    ...mapGetters(['isWidgetPinnedToBottom', 'isWidgetPinnedToTop']),

    fiatCurrency() {
      return get(this.settings, 'fiatCurrency', 'USD');
    },

    currentNet() {
      return get(this.settings, 'net', 1);
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
      'logout',
      'defineOnlyV3Accounts',
      'defineSettings',
      'subscribeOnBalanceUpdates',
      'subscribeOnSettingsUpdates',
      'updateSettings',
      'expandMobileWidget',
      'collapseMobileWidget',
      'requestPassword',
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
      await this.updateSettings({
        lastActiveAccount: address,
      });
    },

    async handleLogout() {
      try {
        this.logout();
      } catch (err) {
        /* eslint-disable-next-line */
        console.log(err);
      }
    },
  },

  async mounted() {
    await this.defineSettings();
    await this.initWidget();
    await this.defineOnlyV3Accounts();
    this.subscribeOnBalanceUpdates();
  },

  components: {
    WidgetHeader: () =>
      import(/* webpackChunkName: "widgetHeader" */ './Header.vue'),
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
