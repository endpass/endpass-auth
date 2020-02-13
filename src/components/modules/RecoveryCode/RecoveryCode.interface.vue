<template>
  <recovery-code
    :email="email"
    @otp-recovered="onRecovered"
    @cancel="onCancel"
  />
</template>

<script>
import RecoveryCode from './RecoveryCode.interactor';

export default {
  props: {
    email: {
      type: String,
      default: '',
    },
  },

  methods: {
    onRecovered() {
      this.$emit('recovered');
    },

    onCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    RecoveryCode,
  },
};
</script>
