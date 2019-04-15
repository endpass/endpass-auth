<template>
  <accordion :collapsed="collapsed">
    <section class="widget-content">
      <accordion :collapsed="isAccountsCollapsed" max-height="225px">
        <option-button
          slot="control"
          :big="true"
          icon="arrow - left"
          @click="handleAccountsButtonClick"
        >
          Change account
        </option-button>
        <template v-if="!isEmptyAccounts">
          <option-button
            v-for="account in accounts"
            :key="account.address"
            @click="handleAccountButtonClick(account.address)"
          >
            {{ account.address }}
          </option-button>
        </template>
      </accordion>
      <option-button
        :big="true"
        icon="arrow - left"
        @click="handleLogoutButtonClick"
      >
        Logout
      </option-button>
    </section>
  </accordion>
</template>

<script>
import OptionButton from './OptionButton.vue';
import Accordion from './Accordion.vue';

export default {
  name: 'WidgetContent',

  props: {
    accounts: {
      type: Array,
      default: () => [],
    },

    collapsed: {
      type: Boolean,
      default: true,
    },

    isAccountsCollapsed: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    isEmptyAccounts() {
      return this.accounts.length === 0;
    },

    accountsButtonLabel() {
      return this.isEmptyAccounts ? 'Create account' : 'Change account';
    },
  },

  methods: {
    handleAccountsButtonClick() {
      if (this.isEmptyAccounts) {
        this.$emit('account-create');
      } else {
        this.$emit('accounts-toggle');
      }
    },

    handleAccountButtonClick(account) {
      this.$emit('account-change', account);
    },

    handleLogoutButtonClick() {
      this.$emit('logout');
    },
  },

  components: {
    Accordion,
    OptionButton,
  },
};
</script>

<style lang="postcss">
.widget-content {
  background-color: #fff;
}
</style>
