<template>
  <regular-password-creation
    v-bind="$attrs"
    @password-created="onPasswordCreated"
  />
</template>

<script>
import RegularPasswordCreation from './RegularPasswordCreation.interactor';

export default {
  name: 'RegularPasswordCreationInterface',

  methods: {
    onPasswordCreated({ password }) {
      this.$emit('complete', { password });
    },
  },

  components: {
    RegularPasswordCreation,
  },
};
</script>
