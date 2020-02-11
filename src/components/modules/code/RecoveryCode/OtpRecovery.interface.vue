<template>
  <otp-recovery-container
    :is-loading="isLoading"
    :error="error"
    @send-code="onSendCode"
    @submit="onSubmit"
    @cancel="onCancel"
  />
</template>

<script>
import OtpRecoveryContainer from './OtpRecovery.container';

export default {
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: '',
    },

    isPhoneExist: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    onSendCode() {
      this.$emit('send-code');
    },

    onSubmit() {
      this.$emit('submit', {
        code: this.code,
      });
    },

    onCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    OtpRecoveryContainer,
  },
};
</script>
