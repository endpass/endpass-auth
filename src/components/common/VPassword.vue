<template>
  <v-input
    v-validate="'required|min:8'"
    type="password"
    required
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import VInput from '@endpass/ui/kit/VInput';

export default {
  name: 'Password',

  components: {
    VInput,
  },
};
</script>

<style lang="postcss"></style>
