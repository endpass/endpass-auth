<template>
  <div>
    <otp-form
      v-if="showOtp"
      :loading="loading"
      :error="error"
      @submit="handleOtpSubmit"
      @recover="showOtpRecover"
    />
    <recover-form
      v-else
      :loading="loading"
      :error="error"
      @submit="handleRecoverSubmit"
    />
  </div>
</template>

<script>
import OtpForm from '@/components/forms/Otp';
import RecoverForm from '@/components/forms/Recover';
import { accountsStore, coreStore } from '@/store';

export default {
  name: 'OtpBlockForm',

  data: () => ({
    error: null,
    showOtp: true,
  }),

  computed: {
    loading() {
      return coreStore.loading;
    },
    otpEmail() {
      return accountsStore.otpEmail;
    },
  },

  methods: {
    async handleOtpSubmit(code) {
      try {
        await accountsStore.confirmAuthViaOtp({
          email: this.otpEmail,
          code,
        });
        this.$emit('submit');
      } catch (err) {
        console.error('handle error', err);
        this.setError(this.$i18n.t('components.otpBlock.authFailed'));
      }
    },

    async handleRecoverSubmit(seedPhrase) {
      try {
        await accountsStore.recover({ seedPhrase });
        this.$emit('recover');
      } catch (err) {
        console.error(err);
        this.handleRecoverError(err);
      }
    },

    async showOtpRecover() {
      try {
        await accountsStore.getRecoveryIdentifier();
        this.showOtp = false;
      } catch (err) {
        console.error(err);
        this.handleRecoverError(err);
      }
    },

    setError(message) {
      this.error = message;
    },

    handleRecoverError(error) {
      const msg =
        (error && error.message) ||
        this.$i18n.t('components.otpBlock.recoverFailed');
      this.setError(msg);
    },
  },

  components: {
    OtpForm,
    RecoverForm,
  },
};
</script>
