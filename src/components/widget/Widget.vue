<template>
  <div class="widget">
    <div v-if="isMobile" ref="trigger" class="widget-trigger">
      <trigger-button
        :is-loading="isWidgetLoading"
        @click="handleMobileTriggerClick"
      />
    </div>
    <div
      v-show="isWidgetFrameVisible"
      ref="widget"
      :class="{ 'widget-frame': true, mobile: isMobile, visible: isExpanded }"
    >
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
  </div>
</template>

<script>
import get from 'lodash/get';
import { mapActions, mapState } from 'vuex';
import WidgetHeader from './Header.vue';
import WidgetContent from './Content.vue';
import TriggerButton from './TriggerButton.vue';

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
      isMobile: state => state.widget.isMobile,
      isExpanded: state => state.widget.isExpanded,
      isWidgetLoading: state => state.widget.isLoading,
    }),

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
    await this.initWidget();
    await this.defineSettings();
    await this.defineOnlyV3Accounts();
    this.subscribeOnBalanceUpdates();
  },

  components: {
    WidgetHeader,
    WidgetContent,
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
  bottom: 0;
  left: 50%;
  width: 240px;
  transform: translateX(-50%);
  border-radius: 4px;

  &.mobile {
    position: absolute;
    left: 0;
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
