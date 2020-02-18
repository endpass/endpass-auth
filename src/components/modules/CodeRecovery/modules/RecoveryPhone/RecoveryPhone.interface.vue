<template>
  <recovery-phone
    :is-loading="isLoading"
    :error="error"
    :is-phone-exist="isPhoneExist"
    @submit="onSubmit"
    @cancel="onCancel"
    @send-code="onSendCode"
  />
</template>

<script>
import RecoveryPhone from './RecoveryPhone.container';

export default {
  name: 'RecoveryPhoneInterface',

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
      this.$emit('recovery-cancel');
    },
  },

  components: {
    RecoveryPhone,
  },
};
</script>
