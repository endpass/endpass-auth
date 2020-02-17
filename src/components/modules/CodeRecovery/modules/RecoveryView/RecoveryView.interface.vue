<template>
  <recovery-view
    :is-loading="isLoading"
    :error="error"
    :is-phone-exist="isPhoneExist"
    @submit="onSubmit"
    @cancel="onCancel"
    @send-code="onSendCode"
  />
</template>

<script>
import RecoveryView from './RecoveryView.container';

export default {
  name: 'RecoveryViewInterface',

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
    RecoveryView,
  },
};
</script>
