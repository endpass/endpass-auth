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
import { mapState } from 'vuex';
import Network from '@endpass/class/Network';
import VModalCard from '@endpass/ui/kit/VModalCard';
import Screen from '@/components/common/Screen';
import AccountForm from '@/components/forms/Account';
import { accountsStore, coreStore, sharedStore } from '@/store';

export default {
  name: 'User',

  data: () => ({
    formData: {
      activeAccount: null,
      activeNet: null,
    },
    error: null,
    message: null,
  }),

  computed: {
    ...mapState({
      isInited: state => state.core.isInited,
      loading: state => state.core.loading,
      settings: state => state.accounts.settings,
      accounts: state => state.accounts.accounts,
    }),

    isDialog() {
      return coreStore.isDialog;
    },

    networksOptions() {
      return Object.values(Network.DEFAULT_NETWORKS).map(({ id, name }) => ({
        val: id,
        text: name,
      }));
    },

    accountsOptions() {
      if (!this.accounts) return [];

      return this.accounts.map(({ address }) => ({
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

        await accountsStore.updateSettings({
          lastActiveAccount: activeAccount,
          net: activeNet,
        });
      } catch (err) {
        console.error(err);

        this.error = err.message;
      }
    },

    async handleLogout() {
      await coreStore.logout();
    },

    handleCancel() {
      accountsStore.closeAccount();
      coreStore.dialogClose();
    },

    handleDonateRequest() {
      sharedStore.changeLoadingStatus(true);
    },

    handleDonateSuccess() {
      this.message = this.$i18n.t('components.user.donationSuccess');
      sharedStore.changeLoadingStatus(false);
    },

    handleDonateError(e) {
      this.error = e;
      sharedStore.changeLoadingStatus(false);
    },

    handleWindowClose() {
      accountsStore.closeAccount();
      coreStore.dialogClose();
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
