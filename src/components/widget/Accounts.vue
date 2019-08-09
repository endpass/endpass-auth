<template>
  <div class="widget-accounts">
    <option-button
      data-test="new-account-button"
      @click="handleNewAccountClick"
    >
      {{ $t('components.widgetContent.newAccount') }}
    </option-button>
    <div class="widget-accounts-scroll-mask-wrapper">
      <ul
        ref="list"
        class="widget-accounts-list"
        :style="{ width: listWidth }"
      >
        <li
          v-for="account in actualAccounts"
          :key="account.address"
        >
          <option-button
            :icon="currentAccount === account.address ? 'check' : null"
            :disabled="isLoading"
            icon-fill="#4B0470"
            data-test="account-button"
            @click="handleAccountButtonClick(account.address)"
          >
            <span class="widget-accounts-item-address">
              <i class="widget-accounts-item-identicon">
                <identicon
                  :address="account.address"
                  :is-small="true"
                />
              </i>
              <span>{{ formatAddress(account.address) }}</span>
            </span>
          </option-button>
        </li>
      </ul>
    </div>
    <option-button
      :disabled="isLoading"
      icon="arrow"
      data-test="logout-button"
      @click="handleLogoutButtonClick"
    >
      {{ $t('global.logout') }}
    </option-button>
  </div>
</template>

<script>
import { getShortStringWithEllipsis } from '@endpass/utils/strings';
import Identicon from '@/components/common/Identicon';
import OptionButton from './OptionButton.vue';

export default {
  name: 'WidgetAccounts',

  props: {
    currentAccount: {
      type: String,
      default: null,
    },

    accounts: {
      type: Array,
      default: () => [],
    },

    isCollapsed: {
      type: Boolean,
      default: true,
    },

    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    scrollWidth: 0,
  }),

  computed: {
    actualAccounts() {
      return this.accounts.filter(account => !!account.address);
    },

    listWidth() {
      return `calc(100% + ${this.scrollWidth}px)`;
    },
  },

  methods: {
    getScrollBarWidth() {
      const { offsetWidth, clientWidth } = this.$refs.list;

      return offsetWidth - clientWidth;
    },

    handleAccountsButtonClick() {
      this.$emit('accounts-toggle');
    },

    handleNewAccountClick() {
      this.$emit('new-account');
    },

    handleAccountButtonClick(account) {
      this.$emit('account-change', account);
    },

    handleLogoutButtonClick() {
      this.$emit('logout');
    },

    formatAddress(address) {
      return getShortStringWithEllipsis(address, 11);
    },
  },

  updated() {
    this.scrollWidth = this.getScrollBarWidth();
  },

  components: {
    Identicon,
    OptionButton,
  },
};
</script>

<style lang="postcss">
.widget-accounts-scroll-mask-wrapper {
  overflow-x: hidden;
  width: 100%;
}

.widget-accounts-list {
  overflow-y: auto;
  max-height: 240px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.widget-accounts-item-address {
  display: inline-flex;
  align-items: center;
}

.widget-accounts-item-identicon {
  flex: 0 0 auto;
  margin-right: 13px;
  margin-bottom: 3px;
}
</style>
