<template>
  <recovery-code
    :email="email"
    @recovered="onRecovered"
    @recovery-cancel="onCancel"
  />
</template>

<script>
import RecoveryCode from './RecoveryCode.interactor';

export default {
  name: 'RecoveryCodeInterface',

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
      this.$emit('recovery-cancel');
    },
  },

  components: {
    RecoveryCode,
  },
};
</script>
