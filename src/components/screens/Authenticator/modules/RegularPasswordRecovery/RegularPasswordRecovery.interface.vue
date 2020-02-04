<template>
  <regular-password-recovery
    v-bind="$attrs"
    @password-recovered="onPasswordRecovered"
    @cancel="onCancel"
  />
</template>

<script>
import RegularPasswordRecovery from './RegularPasswordRecovery.interactor';

export default {
  name: 'RegularPasswordRecoveryInterface',

  methods: {
    onPasswordRecovered({ password }) {
      this.$emit('complete', { password });
    },

    onCancel() {
      this.$emit('switch', { to: 'regular-password' });
    },
  },

  components: {
    RegularPasswordRecovery,
  },
};
</script>
