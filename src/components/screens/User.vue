<template>
  <screen @close="handleWindowClose">
    <v-modal-card
      :is-closable="isDialog"
      @close="handleCancel"
    >
      <account-form
        :loading="loading"
        :closable="isDialog"
        :accounts="accountsOptions"
        :networks="networksOptions"
        :form-data="formData"
        :error="error"
        :message="message"
        @donate-request="handleDonateRequest"
        @donate-success="handleDonateSuccess"
        @donate-error="handleDonateError"
        @submit="handleAccountFormSubmit"
        @cancel="handleCancel"
        @logout="handleLogout"
      />
    </v-modal-card>
  </screen>
</template>

<script>
import Network from '@endpass/class/Network';
import VModalCard from '@endpass/ui/kit/VModalCard';
import Screen from '@/components/common/Screen';
import AccountForm from '@/components/forms/Account';
import { accountsStore, coreStore, sharedStore } from '@/store';

export default {
  name: 'User',

  accountsStore,
  coreStore,
  sharedStore,

  data: () => ({
    formData: {
      activeAccount: null,
      activeNet: null,
    },
    error: null,
    message: null,
  }),

  computed: {
    isInited() {
      return this.$options.coreStore.isInited;
    },

    loading() {
      return this.$options.coreStore.loading;
    },

    settings() {
      return this.$options.accountsStore.settings;
    },

    isDialog() {
      return this.$options.coreStore.isDialog;
    },

    networksOptions() {
      return Object.values(Network.DEFAULT_NETWORKS).map(({ id, name }) => ({
        val: id,
        text: name,
      }));
    },

    accountsOptions() {
      if (!this.$options.accountsStore.accounts) return [];

      return this.$options.accountsStore.accounts.map(({ address }) => ({
        val: address,
        text: address,
      }));
    },
  },

  watch: {
    formData: {
      handler() {
        if (this.message) {
          this.message = null;
        }

        if (this.error) {
          this.error = null;
        }
      },
      deep: true,
    },
  },

  methods: {
    async handleAccountFormSubmit() {
      const { activeAccount, activeNet } = this.formData;

      try {
        this.error = null;

        await this.$options.accountsStore.updateSettings({
          lastActiveAccount: activeAccount,
          net: activeNet,
        });
      } catch (err) {
        console.error(err);

        this.error = err.message;
      }
    },

    async handleLogout() {
      await this.$options.coreStore.logout();
    },

    handleCancel() {
      this.$options.accountsStore.closeAccount();
      this.$options.coreStore.dialogClose();
    },

    handleDonateRequest() {
      this.$options.sharedStore.changeLoadingStatus(true);
    },

    handleDonateSuccess() {
      this.message = this.$i18n.t('components.user.donationSuccess');
      this.$options.sharedStore.changeLoadingStatus(false);
    },

    handleDonateError(e) {
      this.error = e;
      this.$options.sharedStore.changeLoadingStatus(false);
    },

    handleWindowClose() {
      this.$options.accountsStore.closeAccount();
      this.$options.coreStore.dialogClose();
    },
  },

  async created() {
    const { settings } = this;
    this.formData.activeAccount = settings.lastActiveAccount;
    this.formData.activeNet = settings.net;
  },

  components: {
    VModalCard,
    Screen,
    AccountForm,
  },
};
</script>
