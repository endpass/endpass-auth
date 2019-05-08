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
import { mapActions, mapState } from 'vuex';
import OtpForm from '@/components/forms/CompositeAuth/Otp';
import RecoverForm from '@/components/forms/CompositeAuth/Recover';

export default {
  name: 'OtpBlockForm',

  data: () => ({
    error: null,
    showOtp: true,
  }),

  computed: {
    ...mapState({
      loading: state => state.core.loading,
      otpEmail: state => state.accounts.otpEmail,
    }),
  },

  methods: {
    ...mapActions(['confirmAuthViaOtp', 'getRecoveryIdentifier', 'recover']),

    async handleOtpSubmit(code) {
      try {
        await this.confirmAuthViaOtp({
          email: this.otpEmail,
          code,
        });
        this.$emit('submit');
      } catch (err) {
        console.error('handle error', err);
        this.setError('Auth failed. Please, try again');
      }
    },

    async handleRecoverSubmit(seedPhrase) {
      try {
        await this.recover({ seedPhrase });
        this.$emit('recover');
      } catch (err) {
        console.error(err);
        this.handleRecoverError(err);
      }
    },

    async showOtpRecover() {
      try {
        await this.getRecoveryIdentifier();
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
      const msg = (error && error.message) || 'Recover failed. Please, try again';
      this.setError(msg);
    },
  },

  components: {
    OtpForm,
    RecoverForm,
  },
};
</script>
