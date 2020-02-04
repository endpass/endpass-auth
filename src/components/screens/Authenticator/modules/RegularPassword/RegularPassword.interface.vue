<template>
  <regular-password
    @submit="onSubmit"
    @recover="onRecover"
  />
</template>

<script>
import RegularPassword from './RegularPassword.view';

export default {
  name: 'RegularPasswordInterface',

  methods: {
    onSubmit({ password }) {
      this.$emit('complete', { password });
    },

    onRecover() {
      this.$emit('switch', { to: 'regular-password-recovery' });
    },
  },

  components: {
    RegularPassword,
  },
};
</script>
