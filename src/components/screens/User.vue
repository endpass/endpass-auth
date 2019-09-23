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
        :can-logout="!isDemoMode"
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
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex';
import Network from '@endpass/class/Network';
import VModalCard from '@endpass/ui/kit/VModalCard';
import Screen from '@/components/common/Screen';
import AccountForm from '@/components/forms/Account';

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
      isDemoMode: state => !!state.accounts.demoData,
      accounts: state => state.accounts.accounts,
    }),
    ...mapGetters(['isDialog']),

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
    ...mapMutations(['changeLoadingStatus']),
    ...mapActions(['logout', 'closeAccount', 'updateSettings', 'dialogClose']),

    async handleAccountFormSubmit() {
      const { activeAccount, activeNet } = this.formData;

      try {
        this.error = null;

        await this.updateSettings({
          lastActiveAccount: activeAccount,
          net: activeNet,
        });
      } catch (err) {
        console.error(err);

        this.error = err.message;
      }
    },

    async handleLogout() {
      this.logout();
    },

    handleCancel() {
      this.closeAccount();
      this.dialogClose();
    },

    handleDonateRequest() {
      this.changeLoadingStatus(true);
    },

    handleDonateSuccess() {
      this.message = this.$i18n.t('components.user.donationSuccess');
      this.changeLoadingStatus(false);
    },

    handleDonateError(e) {
      this.error = e;
      this.changeLoadingStatus(false);
    },

    handleWindowClose() {
      this.closeAccount();
      this.dialogClose();
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
