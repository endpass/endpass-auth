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
import OtpForm from './OtpForm';
import RecoverForm from './RecoverForm';
import { accountsStore, coreStore } from '@/store';

export default {
  name: 'Otp',

  accountsStore,
  coreStore,

  data: () => ({
    error: null,
    showOtp: true,
  }),

  computed: {
    loading() {
      return this.$options.coreStore.loading;
    },
    otpEmail() {
      return this.$options.accountsStore.otpEmail;
    },
  },

  methods: {
    async handleOtpSubmit(code) {
      try {
        await this.$options.accountsStore.confirmAuthViaOtp({
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
        await this.$options.accountsStore.recover({ seedPhrase });
        this.$emit('recover');
      } catch (err) {
        console.error(err);
        this.handleRecoverError(err);
      }
    },

    async showOtpRecover() {
      try {
        await this.$options.accountsStore.getRecoveryIdentifier();
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
