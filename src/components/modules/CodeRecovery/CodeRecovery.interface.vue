<template>
  <code-recovery
    :email="email"
    @recovered="onRecovered"
    @recovery-cancel="onCancel"
  />
</template>

<script>
import CodeRecovery from './CodeRecovery.interactor';

export default {
  name: 'CodeRecoveryInterface',

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
    CodeRecovery,
  },
};
</script>
