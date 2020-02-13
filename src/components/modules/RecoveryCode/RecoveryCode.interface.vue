<template>
  <otp-recovery
    :is-loading="isLoading"
    :error="error"
    @send-code="onSendCode"
    @submit="onSubmit"
    @cancel="onCancel"
  />
</template>

<script>
import OtpRecovery from './RecoveryCode.container';

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

    onSubmit({ code }) {
      this.$emit('submit', { code });
    },

    onCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    OtpRecovery,
  },
};
</script>
